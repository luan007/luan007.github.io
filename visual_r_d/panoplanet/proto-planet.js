import * as dat from "dat.gui";
const gui = new dat.GUI();

import * as three from "three";
window.THREE = three;


import * as threeB from "./three-base";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { NoiseEffect, BloomEffect, EffectComposer, EffectPass, RenderPass, KernelSize, BlendFunction, ToneMappingEffect, ClearPass } from "postprocessing";
import { UnrealBloomPass } from "./patched/UnreallBloomPassPatched";
import { FilmPass } from "three/examples/jsm/postprocessing/FilmPass";


import * as Nodes from 'three/examples/jsm/nodes/Nodes.js';
import { Clock, PerspectiveCamera, Scene, WebGLRenderer, FloatType, TextureLoader } from "three";

var cube_target = new three.WebGLCubeRenderTarget(2048, {
    encoding: three.sRGBEncoding,
    type: three.HalfFloatType
})
var clock = new THREE.Clock();
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer({
    powerPreference: "high-performance",
	antialias: false,
	stencil: false,
	depth: false
});
var camera = new three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var cube_cam = new three.CubeCamera(0.1, 3000, cube_target);
camera.position.z = 10;
threeB.renderer_fullscreen_dpi(renderer); //充满页面
threeB.renderer_shadow_vsm(renderer); //开启VSM阴影
threeB.renderer_tone_mapping(renderer, scene, { //电影原色标准ToneMapping 以及启动sRGB
    aces_exposure: 1.5
}, gui.addFolder("renderer.toneMapping"));
threeB.renderer_patch_postprocessing(renderer);


var o = new OrbitControls(camera, renderer.domElement);
document.body.appendChild(renderer.domElement);



var grp = new three.Group();
var grp2 = new three.Group();


for (var i = 0; i < 30; i++) {
    var geometry = new THREE.SphereGeometry(0.05, 60, 60);
    var material = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 1, roughness: 1, emissiveIntensity: Math.random() * 10, emissive: 0xffff33 });
    var cube = new THREE.Mesh(geometry, material);
    cube.receiveShadow = true;
    cube.castShadow = true;
    cube.position.set(Math.round((Math.random() - 0.5) * 20), 1, Math.round((Math.random() - 0.5) * 20));
    grp.add(cube);
}

for (var i = 0; i < 2; i++) {
    var geometry = new THREE.SphereGeometry(0.3, 60, 60);
    var material = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 1, roughness: 1, emissiveIntensity: 20, emissive: 0xff11ff });
    var cube = new THREE.Mesh(geometry, material);
    cube.receiveShadow = true;
    cube.castShadow = true;
    cube.position.set(Math.round((Math.random() - 0.5) * 20), 1, Math.round((Math.random() - 0.5) * 20));
    grp.add(cube);
}

var dl = new THREE.DirectionalLight(0xffffff, 0.1);
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
dirLight.shadow.radius = 2;
dirLight.shadow.bias = -0.0001;
dl.lookAt(0, 0, 0);
dl.castShadow = true;
dl.receiveShadow = true;
// scene.add(helper);


scene.add(new THREE.AmbientLight(0xffffff, 1));

scene.fog = new THREE.FogExp2(0, 0.01);
scene.add(grp);
scene.add(grp2);


var planegeo = new THREE.PlaneGeometry(30, 30);
var planemat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 1 });
var floor = new THREE.Mesh(planegeo, planemat);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.5;
floor.receiveShadow = true;
floor.castShadow = true;

grp.add(floor);



var fxMat = new THREE.MeshBasicMaterial({
    envMap: cube_target, //球背面反射图来自cube camera拍摄
    side: three.BackSide
});

// var fxTest = new THREE.SphereGeometry(3, 150, 150);
var fxTest = new THREE.TetrahedronBufferGeometry(3, 2);
var fxMesh = new THREE.Mesh(fxTest, fxMat);
grp2.add(fxMesh);

var fxMat2 = new THREE.MeshBasicMaterial({
    wireframe: true, 
    color: 0xff3300,
    envMap: cube_target,
    side: three.FrontSide //正面线框 + 反射，错觉
});

var fxMesh = new THREE.Mesh(fxTest, fxMat2);
grp2.add(fxMesh);


window.cam_target = 10;


const composer = new EffectComposer(renderer, {
    frameBufferType: THREE.HalfFloatType,
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

var fxPass = new EffectPass(camera, toneMappingEffect);
fxPass.renderToScreen = true;
composer.addPass(fxPass);

var animate = function () {
    requestAnimationFrame(animate);

    renderer.autoClear = true;
    // camera.position.z += (cam_target - camera.position.z) * 0.2;
    renderer.setClearColor(0xffffff);

    // earth.rotation.y += 0.002;
    o.update();
    grp2.visible = true;
    grp.visible = false;
    renderer.clear(true, true, true);
    composer.render(clock.getDelta());

    renderer.setClearColor(0x000000);

    cube_cam.position.copy(camera.position);
    grp2.visible = false;
    grp.visible = true;
    cube_cam.update(renderer, scene);

};

animate();

