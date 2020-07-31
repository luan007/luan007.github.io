import * as dat from "dat.gui";
const gui = new dat.GUI();


import * as three from "three";
window.THREE = three;

import * as Nodes from 'three/examples/jsm/nodes/Nodes.js';
import * as threeB from "./three-base";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { Clock, PerspectiveCamera, Scene, WebGLRenderer, FloatType, TextureLoader } from "three";
import { NoiseEffect, BloomEffect, EffectComposer, EffectPass, RenderPass, KernelSize, BlendFunction, ToneMappingEffect } from "postprocessing";
import { UnrealBloomPass } from "./patched/UnreallBloomPassPatched";
import { FilmPass } from "three/examples/jsm/postprocessing/FilmPass";

// renderer.physicallyCorrectLights = true
// renderer.gammaFactor = 2.2;
// renderer.outputEncoding = THREE.sRGBEncoding;
// renderer.toneMappingExposure = 1.0;
// renderer.toneMapping = THREE.ACESFilmicToneMapping;

//patch shader chunk
// THREE.ShaderChunk.tonemapping_pars_fragment = THREE.ShaderChunk.tonemapping_pars_fragment.replace("return saturate( color );", "return color * 2.0;");
// console.log(THREE.ShaderChunk.tonemapping_pars_fragment);
// console.log(renderer);

// renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.VSMShadowMap;
// renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.setPixelRatio(DPI);

var clock = new Clock();
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();

threeB.renderer_fullscreen_dpi(renderer); //充满页面
threeB.renderer_shadow_vsm(renderer); //开启VSM阴影
threeB.renderer_tone_mapping(renderer, scene, { //电影原色标准ToneMapping 以及启动sRGB
    aces_exposure: 1.5
}, gui.addFolder("renderer.toneMapping"));
threeB.renderer_patch_postprocessing(renderer);
document.body.appendChild(renderer.domElement);

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const composer = new EffectComposer(renderer, {
    frameBufferType: THREE.FloatType,
});


const ubloomPass = new UnrealBloomPass(new three.Vector2(512, 512));
ubloomPass.threshold = 1.7;
ubloomPass.strength = 0.8;
ubloomPass.radius = 0.8;

const ubloomPass2 = new UnrealBloomPass(new three.Vector2(512, 512));
ubloomPass2.threshold = 1.2;
ubloomPass2.strength = 0.4;
ubloomPass2.radius = 1;

const film = new FilmPass(0.6, 0, 0, false);

composer.addPass(new RenderPass(scene, camera));
composer.addPass(ubloomPass);
composer.addPass(ubloomPass2);
composer.addPass(film);

const toneMappingEffect = new ToneMappingEffect({
    blendFunction: BlendFunction.NORMAL,
    adaptive: true,
    resolution: 256,
    middleGrey: 0.6,
    maxLuminance: 16.0,
    averageLuminance: 1.0,
    adaptationRate: 3.0
});

composer.addPass(new EffectPass(camera, toneMappingEffect));

var o = new OrbitControls(camera, renderer.domElement);
var loader = new THREE.TextureLoader();

// var earthGeo = new three.IcosahedronGeometry(2, 7);
var earthGeo = new three.IcosahedronGeometry(1, 4);
var earthMat = new Nodes.StandardNodeMaterial();

var m_cloud = new Nodes.TextureNode(
    loader.load("./earth/Earth-clouds.png")
);
var n_time = new Nodes.FloatNode(0.0);

var n_color = new Nodes.FunctionNode(
    `vec4 n_color(sampler2D tx, sampler2D cloud, sampler2D n_cloud, vec2 uv, float time) {
       vec4 main = texture2D(tx, uv);
       vec2 cloudUV = (uv);
       cloudUV.x -= time * .8;
       cloudUV.y -= time * .3;
       cloudUV = mod(cloudUV, 1.0);

       vec2 cloudTUV = (uv + time);
       cloudTUV.x += time * .5;
       cloudTUV.y += time * .3;
       cloudTUV = mod(cloudTUV, 1.0);

       float c = pow(texture2D(cloud, cloudUV).a, 4.0) * 0.7;
       float q = pow(texture2D(n_cloud, cloudTUV).r, 2.0) * 2.0;
    //    c *= q;
       return mix(main, vec4(1.0), vec4(c, c, c, 1.0));
    }`
    , [new Nodes.ConstNode("float BLUR_ITERATIONS 10.0")]
);

var tx_e10k = loader.load("./earth/8081_earthmap10k.jpg");
tx_e10k.encoding = THREE.sRGBEncoding;
earthMat.color = new Nodes.FunctionCallNode(n_color, {
    tx: new Nodes.TextureNode(
        tx_e10k
    ),
    cloud: m_cloud,
    n_cloud: new Nodes.TextureNode(
        loader.load("./earth/clouds.jpg")
    ),
    time: n_time,
    uv: new Nodes.UVNode()
});


var n_emissive = new Nodes.FunctionNode(
    `vec4 n_emissive(float edge_boost, float rim_pow, float rim_intensity, vec4 tint, vec4 rim_tint, sampler2D cloud, float time, sampler2D tx, vec2 uv, ReflectedLight light, vec3 norm, vec3 pos) {
       float lt = pow(texture2D(tx, uv).r, 2.0) * 1.5;
       const vec3 W = vec3(0.2125, 0.7154, 0.0721);
       float tq = pow(1.0 - min(1.0, dot(light.directDiffuse, W)), 8.0);
       vec2 cloudUV = (uv);
       cloudUV.x -= time * .8;
       cloudUV.y -= time * .3;
       cloudUV = mod(cloudUV, 1.0);
       float c = 1.0 - (pow(texture2D(cloud, cloudUV).a, 2.0) * .8);
       float rim = pow(dot(norm, vec3(0.0, 0.0, -rim_intensity)) + rim_intensity, rim_pow);
       float boost_rim = pow(dot(norm, vec3(0.0, 0.0, -1.0)) + 1.0, 4.0);
       float boost = (pow(1.0 - tq, 2.0) * edge_boost * 8.0) * boost_rim; //front shine > back shine, boost front shine
       vec4 col = tint * vec4(lt, lt, lt, 1.0) * (tq) * 7.0 * c;
       col += rim * rim_tint;
       col += boost * vec4(1.0,1.0,1.0,1.0);
       col.a = 1.0;
       return col;
    }`
);

earthMat.emissive = new Nodes.FunctionCallNode(n_emissive, {
    tx: new Nodes.TextureNode(
        loader.load("./earth/8081_earthlights4k.jpg")
    ),
    uv: new Nodes.UVNode(),
    light: {
        build: () => {
            return "reflectedLight"
        }
    },
    cloud: m_cloud,
    time: n_time,
    rim_intensity: new Nodes.FloatNode(1.0),
    rim_pow: new Nodes.FloatNode(4.6),
    tint: new Nodes.ColorNode(new three.Color(1.0 * 0.3, 0.5 * 0.3, 0.3 * 0.3)),
    rim_tint: new Nodes.ColorNode(new three.Color(0.2, 0.8, 1.0)),
    norm: new Nodes.NormalNode(Nodes.NormalNode.VIEW),
    pos: new Nodes.CameraNode(Nodes.CameraNode.TO_VERTEX),
    edge_boost: new Nodes.FloatNode(1.0)
});

var n_displace = new Nodes.FunctionNode(
    `vec3 n_displace(vec3 pos, vec2 uv, vec3 norm, sampler2D dispMap) {
       float d = pow(texture2D(dispMap, uv).x, 2.0);
       return pos + norm * d * 0.12;
    }`
);

earthMat.position = new Nodes.FunctionCallNode(n_displace, {
    pos: new Nodes.PositionNode(),
    uv: new Nodes.UVNode(),
    dispMap: new Nodes.TextureNode(loader.load("./earth/8081_earthbump4k.jpg")),
    norm: new Nodes.NormalNode(Nodes.NormalNode.LOCAL)
});


var n_rough = new Nodes.FunctionNode(
    `float n_rough(sampler2D cloud, sampler2D waterNorm, float time, sampler2D tx, vec2 uv) {
        float lt = 1.0 - 0.4 * (texture2D(tx, uv).r);
        vec2 cloudUV = (uv);
        cloudUV.x -= time * .8;
        cloudUV.y -= time * .3;
        cloudUV = mod(cloudUV, 1.0);
        float norm_water = (1.0 - texture2D(waterNorm, uv).r * texture2D(tx, uv).r) * 0.8 + 0.2;
        lt *= (1.0 - pow(texture2D(cloud, cloudUV).a, 2.0));
        lt = lt * 0.6 + 0.4;
        lt *= norm_water;
        return lt;
    }`
);

earthMat.roughness = new Nodes.FunctionCallNode(n_rough, {
    tx: new Nodes.TextureNode(
        loader.load("./earth/black.png")
    ),
    uv: new Nodes.UVNode(),
    waterNorm: new Nodes.TextureNode(
        loader.load("./earth/earthNormalmap.jpg")
    ),
    cloud: m_cloud,
    time: n_time
});


// earthMat.normal = new Nodes.NormalMapNode(
//     new Nodes.TextureNode(loader.load("./earth/earthNormalmap.jpg")), new Nodes.Vector2Node(0.1, 0.3)
// );


// var n_metal = new Nodes.FunctionNode(
//     `float n_metal(sampler2D cloud, sampler2D waterNorm, float time, sampler2D tx, vec2 uv) {
//         float lt = 1.0 - 0.4 * (texture2D(tx, uv).r);
//         vec2 cloudUV = (uv);
//         cloudUV.x -= time * .8;
//         cloudUV.y -= time * .3;
//         cloudUV = mod(cloudUV, 1.0);
//         float norm_water = (1.0 - texture2D(waterNorm, uv).r * texture2D(tx, uv).r) * 0.8 + 0.2;
//         lt *= (1.0 - pow(texture2D(cloud, cloudUV).a, 2.0));
//         lt = lt * 0.6 + 0.4;
//         lt *= norm_water;
//         return lt * 0.1;
//     }`
// );

// earthMat.metalness = new Nodes.FunctionCallNode(n_metal, {
//     tx: new Nodes.TextureNode(
//         loader.load("./earth/black.png")
//     ),
//     uv: new Nodes.UVNode(),
//     waterNorm: new Nodes.TextureNode(
//         loader.load("./earth/earthNormalmap.jpg")
//     ),
//     cloud: m_cloud,
//     time: n_time
// });
earthMat.fog = true;

var earth = new three.Mesh(earthGeo, earthMat);
earth.castShadow = earth.receiveShadow = true;
scene.add(earth);


var dl = new THREE.DirectionalLight(0xffffff, 0.8);
dl.position.set(5, 10, 10);
var dirLight = dl;
dirLight.shadow.camera.near = 0.1;
dirLight.shadow.camera.far = 200;
dirLight.shadow.camera.right = 17;
dirLight.shadow.camera.left = - 17;
dirLight.shadow.camera.top = 17;
dirLight.shadow.camera.bottom = - 17;
dirLight.shadow.mapSize.width = 1024;
dirLight.shadow.mapSize.height = 1024;
dirLight.shadow.radius = 1;
dirLight.shadow.bias = -0.0001;
dl.lookAt(0, 0, 0);
dl.castShadow = true;
dl.receiveShadow = true;
var helper = new THREE.CameraHelper(dl.shadow.camera);
// scene.add(helper);


scene.add(new THREE.AmbientLight(0xffffff, 0.1));

scene.fog = new THREE.FogExp2(0, 0.01);
scene.add(dl);

camera.position.z = 5;

var animate = function () {
    requestAnimationFrame(animate);

    // earth.rotation.y += 0.002;
    // renderer.render(scene, camera);

    n_time.value += 0.0001;
    composer.render(clock.getDelta());
};

animate();

