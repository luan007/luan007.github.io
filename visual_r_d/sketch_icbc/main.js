
import * as dat from 'dat.gui';

import * as three from "three";
window.THREE = three;

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

import { Clock, PerspectiveCamera, Scene, WebGLRenderer, FloatType } from "three";
import { BloomEffect, EffectComposer, EffectPass, RenderPass, KernelSize, BlendFunction, ToneMappingEffect } from "postprocessing";

import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";


UnrealBloomPass.prototype = Object.assign(UnrealBloomPass.prototype, {

    initialize() { },
    originalRender: UnrealBloomPass.prototype.render,

    render(renderer, inputBuffer, outputBuffer, delta, maskActive) {
        this.originalRender(renderer, outputBuffer, inputBuffer, delta, maskActive);
    }

});


const clock = new Clock();
var DPI = window.devicePixelRatio;

var renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(DPI);
document.body.appendChild(renderer.domElement);

import { HalfFloatType } from "three";


var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);


const composer = new EffectComposer(renderer, {
    frameBufferType: FloatType,
});


const bloomPass = new UnrealBloomPass();
bloomPass.threshold = 3.0;
bloomPass.strength = 1;
bloomPass.radius = 1;

composer.addPass(new RenderPass(scene, camera));
composer.addPass(bloomPass);

const toneMappingEffect = new ToneMappingEffect({
    blendFunction: BlendFunction.NORMAL,
    adaptive: true,
    resolution: 256,
    middleGrey: 0.6,
    maxLuminance: 16.0,
    averageLuminance: 1.0,
    adaptationRate: 5.0
});
composer.addPass(new EffectPass(camera, toneMappingEffect));




var o = new OrbitControls(camera, renderer.domElement);


for (var i = 0; i < 30; i++) {
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 1, roughness: 1 });
    var cube = new THREE.Mesh(geometry, material);
    cube.receiveShadow = true;
    cube.castShadow = true;
    cube.position.set(Math.round((Math.random() - 0.5) * 20), 0, Math.round((Math.random() - 0.5) * 20));
    scene.add(cube);
}

for (var i = 0; i < 30; i++) {
    var geometry = new THREE.SphereGeometry(0.5, 60, 60);
    var material = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 1, roughness: 1, emissiveIntensity: Math.random() * 10, emissive: 0xffff33 });
    var cube = new THREE.Mesh(geometry, material);
    cube.receiveShadow = true;
    cube.castShadow = true;
    cube.position.set(Math.round((Math.random() - 0.5) * 20), 1, Math.round((Math.random() - 0.5) * 20));
    scene.add(cube);
}

for (var i = 0; i < 2; i++) {
    var geometry = new THREE.SphereGeometry(0.5, 60, 60);
    var material = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 1, roughness: 1, emissiveIntensity: 20, emissive: 0xff11ff });
    var cube = new THREE.Mesh(geometry, material);
    cube.receiveShadow = true;
    cube.castShadow = true;
    cube.position.set(Math.round((Math.random() - 0.5) * 20), 1, Math.round((Math.random() - 0.5) * 20));
    scene.add(cube);
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
var helper = new THREE.CameraHelper(dl.shadow.camera);
// scene.add(helper);


scene.add(new THREE.AmbientLight(0xffffff, 0.1));

scene.fog = new THREE.FogExp2(0, 0.1);
// scene.add(dl);


var planegeo = new THREE.PlaneGeometry(30, 30);
var planemat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 1 });
var floor = new THREE.Mesh(planegeo, planemat);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.5;
floor.receiveShadow = true;
floor.castShadow = true;

scene.add(floor);

camera.position.z = 5;

var animate = function () {
    requestAnimationFrame(animate);

    // renderer.render(scene, camera);
    composer.render(clock.getDelta());
};

animate();

