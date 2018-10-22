


const VERT = `
	varying vec2 texCoord;
	void main() {
		texCoord = uv;
		gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
	}
`;

const FRAG_FALLOFF = `
uniform sampler2D tDiffuse;
const vec3 luminanceVector = vec3(0.27, 0.67, 0.006);
varying vec2 texCoord;
uniform float tPower;
uniform float booster;

vec4 EncodeRGBE8( in vec3 rgb )
{
	vec4 vEncoded;
	float maxComponent = max(max(rgb.r, rgb.g), rgb.b );
	float fExp = ceil( log2(maxComponent) );
	vEncoded.rgb = rgb / exp2(fExp);
	vEncoded.a = (fExp + 128.0) / 255.0;
	return vEncoded;
}

vec3 DecodeRGBE8( in vec4 rgbe )
{
	vec3 vDecoded;
	float fExp = rgbe.a * 255.0 - 128.0;
	vDecoded = rgbe.rgb * exp2(fExp);
	return vDecoded;
}

void main() {
	vec4 raw = texture2D(tDiffuse, texCoord);
	vec3 col = DecodeRGBE8(raw); 
	float lumi = pow(dot(luminanceVector, col), tPower) * booster;
	gl_FragColor = vec4(lumi * col.r, lumi * col.g, lumi * col.b, 1.0);
}
`;



const FRAG_COPY_DECODE = `
uniform sampler2D tDiffuse;
varying vec2 texCoord;

vec4 EncodeRGBE8( in vec3 rgb )
{
	vec4 vEncoded;
	float maxComponent = max(max(rgb.r, rgb.g), rgb.b );
	float fExp = ceil( log2(maxComponent) );
	vEncoded.rgb = rgb / exp2(fExp);
	vEncoded.a = (fExp + 128.0) / 255.0;
	return vEncoded;
}

vec3 DecodeRGBE8( in vec4 rgbe )
{
	vec3 vDecoded;
	float fExp = rgbe.a * 255.0 - 128.0;
	vDecoded = rgbe.rgb * exp2(fExp);
	return vDecoded;
}

void main() {
	vec4 raw = texture2D(tDiffuse, texCoord);
	gl_FragColor = vec4(DecodeRGBE8(raw), 1.0); //vec4(lumi * col.r, lumi * col.g, lumi * col.b, 1.0);
}
`;


THREE.CopyDecodeShader = {

	uniforms: {
		"tDiffuse": { value: null },
	},
	vertexShader: VERT,
	fragmentShader: FRAG_COPY_DECODE

};


/**
 * @author spidersharma / http://eduperiment.com/
 *
 * Inspired from Unreal Engine
 * https://docs.unrealengine.com/latest/INT/Engine/Rendering/PostProcessEffects/Bloom/
 */
THREE.RealBloomPass = function (resolution, strength, radius, power) {

	THREE.Pass.call(this);

	this.strength = (strength !== undefined) ? strength : 1;
	this.radius = radius;
	this.power = power;
	this.booster = 1;
	this.resolution = (resolution !== undefined) ? new THREE.Vector2(resolution.x, resolution.y) : new THREE.Vector2(256, 256);

	// create color only once here, reuse it later inside the render function
	this.clearColor = new THREE.Color(0, 0, 0);

	// render targets
	var pars = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat };
	this.renderTargetsHorizontal = [];
	this.renderTargetsVertical = [];
	this.nMips = 5;
	var resx = Math.round(this.resolution.x / 2);
	var resy = Math.round(this.resolution.y / 2);

	this.renderTargetBright = new THREE.WebGLRenderTarget(resx, resy, pars);
	this.renderTargetBright.texture.name = "UnrealBloomPass.bright";
	this.renderTargetBright.texture.generateMipmaps = false;

	for (var i = 0; i < this.nMips; i++) {

		var renderTarget = new THREE.WebGLRenderTarget(resx, resy, pars);

		renderTarget.texture.name = "UnrealBloomPass.h" + i;
		renderTarget.texture.generateMipmaps = false;

		this.renderTargetsHorizontal.push(renderTarget);

		var renderTarget = new THREE.WebGLRenderTarget(resx, resy, pars);

		renderTarget.texture.name = "UnrealBloomPass.v" + i;
		renderTarget.texture.generateMipmaps = false;

		this.renderTargetsVertical.push(renderTarget);

		resx = Math.round(resx / 2);

		resy = Math.round(resy / 2);

	}

	// luminosity high pass material

	this.materialHighPassFilter = new THREE.ShaderMaterial({
		uniforms: {
			"tDiffuse": { type: "t", value: null },
			"tPower": { type: "f", value: 3.0 },
			"booster": {type: "f", value: 3.0}
		},
		vertexShader: VERT,
		fragmentShader: FRAG_FALLOFF,
		defines: {}
	});

	// Gaussian Blur Materials
	this.separableBlurMaterials = [];
	var kernelSizeArray = [3, 5, 7, 9, 11];
	var resx = Math.round(this.resolution.x / 2);
	var resy = Math.round(this.resolution.y / 2);

	for (var i = 0; i < this.nMips; i++) {

		this.separableBlurMaterials.push(this.getSeperableBlurMaterial(kernelSizeArray[i]));

		this.separableBlurMaterials[i].uniforms["texSize"].value = new THREE.Vector2(resx, resy);

		resx = Math.round(resx / 2);

		resy = Math.round(resy / 2);

	}

	// Composite material
	this.compositeMaterial = this.getCompositeMaterial(this.nMips);
	this.compositeMaterial.uniforms["blurTexture1"].value = this.renderTargetsVertical[0].texture;
	this.compositeMaterial.uniforms["blurTexture2"].value = this.renderTargetsVertical[1].texture;
	this.compositeMaterial.uniforms["blurTexture3"].value = this.renderTargetsVertical[2].texture;
	this.compositeMaterial.uniforms["blurTexture4"].value = this.renderTargetsVertical[3].texture;
	this.compositeMaterial.uniforms["blurTexture5"].value = this.renderTargetsVertical[4].texture;
	this.compositeMaterial.uniforms["bloomStrength"].value = strength;
	this.compositeMaterial.uniforms["bloomRadius"].value = 0.1;
	this.compositeMaterial.needsUpdate = true;

	var bloomFactors = [1.0, 0.8, 0.6, 0.4, 0.2];
	this.compositeMaterial.uniforms["bloomFactors"].value = bloomFactors;
	this.bloomTintColors = [new THREE.Vector3(1, 1, 1), new THREE.Vector3(1, 1, 1), new THREE.Vector3(1, 1, 1),
	new THREE.Vector3(1, 1, 1), new THREE.Vector3(1, 1, 1)];
	this.compositeMaterial.uniforms["bloomTintColors"].value = this.bloomTintColors;


	var copyShader = THREE.CopyShader;

	this.copyUniforms =
		{
			"opacity": { type: "f", value: 1 },
			"tDiffuse": { type: "t", value: null },
		};

	this.materialCopy = new THREE.ShaderMaterial({
		uniforms: this.copyUniforms,
		vertexShader: copyShader.vertexShader,
		fragmentShader: copyShader.fragmentShader,
		blending: THREE.AdditiveBlending,
		depthTest: false,
		depthWrite: false,
		transparent: false
	});




	this.enabled = true;
	this.needsSwap = false;

	this.oldClearColor = new THREE.Color();
	this.oldClearAlpha = 1;

	this.camera = new THREE.OrthographicCamera(- 1, 1, 1, - 1, 0, 1);
	this.scene = new THREE.Scene();

	this.basic = new THREE.MeshBasicMaterial();

	this.quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), null);
	this.quad.frustumCulled = false; // Avoid getting clipped
	this.scene.add(this.quad);

};

//modified from unreal bloom pass
THREE.RealBloomPass.prototype = Object.assign(Object.create(THREE.Pass.prototype), {

	constructor: THREE.RealBloomPass,

	dispose: function () {

		for (var i = 0; i < this.renderTargetsHorizontal.length; i++) {

			this.renderTargetsHorizontal[i].dispose();

		}

		for (var i = 0; i < this.renderTargetsVertical.length; i++) {

			this.renderTargetsVertical[i].dispose();

		}

		this.renderTargetBright.dispose();

	},

	setSize: function (width, height) {

		//TODO: /2 for width and height
		var resx = Math.round(width);
		var resy = Math.round(height);

		this.renderTargetBright.setSize(resx, resy);

		resx = Math.round(resx / 2);
		resy = Math.round(resy / 2);

		for (var i = 0; i < this.nMips; i++) {

			this.renderTargetsHorizontal[i].setSize(resx, resy);
			this.renderTargetsVertical[i].setSize(resx, resy);

			this.separableBlurMaterials[i].uniforms["texSize"].value = new THREE.Vector2(resx, resy);

			resx = Math.round(resx / 2);
			resy = Math.round(resy / 2);

		}

	},

	render: function (renderer, writeBuffer, readBuffer, delta, maskActive) {

		this.oldClearColor.copy(renderer.getClearColor());
		this.oldClearAlpha = renderer.getClearAlpha();
		var oldAutoClear = renderer.autoClear;
		renderer.autoClear = !this.renderToScreen;

		renderer.setClearColor(this.clearColor, 0);

		if (maskActive) renderer.context.disable(renderer.context.STENCIL_TEST);

		// Render input to screen

		if (this.renderToScreen) {

			this.quad.material = this.basic;
			this.basic.map = readBuffer.texture;

			renderer.render(this.scene, this.camera, undefined, true);

		}

		// 1. Extract Bright Areas

		this.materialHighPassFilter.uniforms["tDiffuse"].value = readBuffer.texture;
		this.materialHighPassFilter.uniforms["tPower"].value = this.power;
		this.materialHighPassFilter.uniforms["booster"].value = this.booster;
		this.quad.material = this.materialHighPassFilter;

		renderer.render(this.scene, this.camera, this.renderTargetBright, true);

		// 2. Blur All the mips progressively

		var inputRenderTarget = this.renderTargetBright;

		for (var i = 0; i < this.nMips; i++) {

			this.quad.material = this.separableBlurMaterials[i];

			this.separableBlurMaterials[i].uniforms["colorTexture"].value = inputRenderTarget.texture;
			this.separableBlurMaterials[i].uniforms["direction"].value = THREE.UnrealBloomPass.BlurDirectionX;
			renderer.render(this.scene, this.camera, this.renderTargetsHorizontal[i], true);

			this.separableBlurMaterials[i].uniforms["colorTexture"].value = this.renderTargetsHorizontal[i].texture;
			this.separableBlurMaterials[i].uniforms["direction"].value = THREE.UnrealBloomPass.BlurDirectionY;
			renderer.render(this.scene, this.camera, this.renderTargetsVertical[i], true);

			inputRenderTarget = this.renderTargetsVertical[i];

		}

		// Composite All the mips

		this.quad.material = this.compositeMaterial;
		this.compositeMaterial.uniforms["bloomStrength"].value = this.strength;
		this.compositeMaterial.uniforms["bloomRadius"].value = this.radius;
		this.compositeMaterial.uniforms["bloomTintColors"].value = this.bloomTintColors;
		this.compositeMaterial.uniforms["rt"].value = readBuffer.texture;

		renderer.render(this.scene, this.camera, this.renderTargetsHorizontal[0], true);


		// Blend it additively over the input texture

		this.quad.material = this.materialCopy;
		this.copyUniforms["tDiffuse"].value = this.renderTargetsHorizontal[0].texture;

		if (maskActive) renderer.context.enable(renderer.context.STENCIL_TEST);


		if (this.renderToScreen) {

			renderer.render(this.scene, this.camera, undefined, false);

		} else {

			renderer.render(this.scene, this.camera, readBuffer, false);

		}

		// Restore renderer settings

		renderer.setClearColor(this.oldClearColor, this.oldClearAlpha);
		renderer.autoClear = oldAutoClear;

	},

	getSeperableBlurMaterial: function (kernelRadius) {

		return new THREE.ShaderMaterial({

			defines: {
				"KERNEL_RADIUS": kernelRadius,
				"SIGMA": kernelRadius
			},

			uniforms: {
				"colorTexture": { value: null },
				"texSize": { value: new THREE.Vector2(0.5, 0.5) },
				"direction": { value: new THREE.Vector2(0.5, 0.5) }
			},

			vertexShader:
				"varying vec2 vUv;\n\
				void main() {\n\
					vUv = uv;\n\
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\
				}",

			fragmentShader:
				"#include <common>\
				varying vec2 vUv;\n\
				uniform sampler2D colorTexture;\n\
				uniform vec2 texSize;\
				uniform vec2 direction;\
				\
				float gaussianPdf(in float x, in float sigma) {\
					return 0.39894 * exp( -0.5 * x * x/( sigma * sigma))/sigma;\
				}\
				void main() {\n\
					vec2 invSize = 1.0 / texSize;\
					float fSigma = float(SIGMA);\
					float weightSum = gaussianPdf(0.0, fSigma);\
					vec3 diffuseSum = texture2D( colorTexture, vUv).rgb * weightSum;\
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {\
						float x = float(i);\
						float w = gaussianPdf(x, fSigma);\
						vec2 uvOffset = direction * invSize * x;\
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset).rgb;\
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset).rgb;\
						diffuseSum += (sample1 + sample2) * w;\
						weightSum += 2.0 * w;\
					}\
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);\n\
				}"
		});

	},

	getCompositeMaterial: function (nMips) {

		return new THREE.ShaderMaterial({

			defines: {
				"NUM_MIPS": nMips
			},

			uniforms: {
				"rt": { value: null },
				"blurTexture1": { value: null },
				"blurTexture2": { value: null },
				"blurTexture3": { value: null },
				"blurTexture4": { value: null },
				"blurTexture5": { value: null },
				"dirtTexture": { value: null },
				"bloomStrength": { value: 1.0 },
				"bloomFactors": { value: null },
				"bloomTintColors": { value: null },
				"bloomRadius": { value: 0.0 }
			},

			vertexShader:
				"varying vec2 vUv;\n\
				void main() {\n\
					vUv = uv;\n\
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\
				}",

			fragmentShader:
				`varying vec2 vUv;
				uniform sampler2D rt;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform sampler2D dirtTexture;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];
				
				vec4 EncodeRGBE8( in vec3 rgb )
				{
					vec4 vEncoded;
					float maxComponent = max(max(rgb.r, rgb.g), rgb.b );
					float fExp = ceil( log2(maxComponent) );
					vEncoded.rgb = rgb / exp2(fExp);
					vEncoded.a = (fExp + 128.0) / 255.0;
					return vEncoded;
				}

				vec3 DecodeRGBE8( in vec4 rgbe )
				{
					vec3 vDecoded;
					float fExp = rgbe.a * 255.0 - 128.0;
					vDecoded = rgbe.rgb * exp2(fExp);
					return vDecoded;
				}


				float lerpBloomFactor(const in float factor) { 
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}
								
				void main() {
					vec3 cola = DecodeRGBE8(texture2D(rt, vUv));
					vec4 colb = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) + 
													 lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) + 
													 lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) + 
													 lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) + 
													 lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
					gl_FragColor = vec4(cola, 1.0) + colb;
				}`
		});

	}

});

THREE.RealBloomPass.BlurDirectionX = new THREE.Vector2(1.0, 0.0);
THREE.RealBloomPass.BlurDirectionY = new THREE.Vector2(0.0, 1.0);
