import * as dat from "dat.gui";
import * as three from "three";
window.THREE = three;
import * as meshline from "three.meshline";

const gui = new dat.GUI();
var t = 0;
window.state = {
    scene: 1
};


function loop(fn) { loop.l = loop.l || []; loop.l.push(fn); }
function runLoop() { loop.l = loop.l || []; loop.l.forEach(v => v()); }
function ease(cur, to, e) { return cur + (to - cur) * e; }

import * as threeB from "./three-base";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { NoiseEffect, BloomEffect, EffectComposer, EffectPass, RenderPass, KernelSize, BlendFunction, ToneMappingEffect, ClearPass } from "postprocessing";
import { UnrealBloomPass } from "./patched/UnreallBloomPassPatched";
import { FilmPass } from "three/examples/jsm/postprocessing/FilmPass";
import { PointsMaterial } from "three";

var clock = new THREE.Clock();
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer({
    powerPreference: "high-performance",
    antialias: true,
    stencil: false,
    depth: false
});
renderer.setClearColor(0);
var camera = new three.PerspectiveCamera(10, window.innerWidth / window.innerHeight, 0.1, 5000);
camera.position.z = 100;
threeB.renderer_fullscreen_dpi(renderer); //充满页面
threeB.renderer_shadow_vsm(renderer); //开启VSM阴影
threeB.renderer_tone_mapping(renderer, scene, { //电影原色标准ToneMapping 以及启动sRGB
    aces_exposure: 1.5
}, gui.addFolder("renderer.toneMapping"));
threeB.renderer_patch_postprocessing(renderer);

var o = new OrbitControls(camera, renderer.domElement);
document.body.appendChild(renderer.domElement);


var grp = new three.Group();

var dl = new THREE.DirectionalLight(0xffffff, 1);
dl.position.set(5, 10, 10);
var dirLight = dl;
dirLight.shadow.camera.near = 0.1;
dirLight.shadow.camera.far = 100;
dirLight.shadow.camera.right = 50;
dirLight.shadow.camera.left = - 50;
dirLight.shadow.camera.top = 50;
dirLight.shadow.camera.bottom = - 50;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
dirLight.shadow.radius = 2;
dirLight.shadow.bias = -0.0001;
dl.lookAt(0, 0, 0);
dl.castShadow = true;
dl.receiveShadow = true;
grp.add(dl);


scene.add(new three.AmbientLight(0xffffff, 1));

// scene.fog = new THREE.FogExp2(0, 0.01);
scene.add(grp);


// var planegeo = new THREE.PlaneGeometry(30, 30);
// var planemat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0.3 });
// var floor = new THREE.Mesh(planegeo, planemat);
// floor.rotation.x = -Math.PI / 2;
// floor.position.y = -0.5;
// floor.receiveShadow = true;
// floor.castShadow = true;
// grp.add(floor);


//universe
var points_geo = new three.Geometry();
for (var i = 0; i < 10000; i++) {
    var v = new three.Vector3((Math.random() + 0.5) * 400, 0, 0);
    v.applyEuler(new three.Euler(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2));
    points_geo.vertices.push(new three.Vector3(
        v.x, v.y, v.z
    ));
}
var points = new three.Points(points_geo, new PointsMaterial({
    color: new three.Color(3.0, 3.0, 3.0),
    size: 2,
}));

scene.add(points);

const composer = new EffectComposer(renderer, {
    frameBufferType: THREE.HalfFloatType,
});

function post_fx() {
    const ubloomPass = new UnrealBloomPass(new three.Vector2(512, 512));
    ubloomPass.threshold = 1.2;
    ubloomPass.strength = 0.8;
    ubloomPass.radius = 0.8;

    const ubloomPass2 = new UnrealBloomPass(new three.Vector2(512, 512));
    ubloomPass2.threshold = 1.2;
    ubloomPass2.strength = 0.4;
    ubloomPass2.radius = 1;

    const film = new FilmPass(0.4, 0, 0, false);

    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(ubloomPass);
    composer.addPass(ubloomPass2);
    composer.addPass(film);

    // const toneMappingEffect = new ToneMappingEffect({
    //     blendFunction: BlendFunction.NORMAL,
    //     adaptive: true,
    //     resolution: 256,
    //     middleGrey: 0.6,
    //     maxLuminance: 16.0,
    //     averageLuminance: 1.0,
    //     adaptationRate: 3.0
    // });
    // var fxPass = new EffectPass(camera, toneMappingEffect);
    // fxPass.renderToScreen = true;
    // composer.addPass(fxPass);
}

post_fx();

var animate = function () {
    t += 0.01;
    requestAnimationFrame(animate);
    runLoop();
    // renderer.autoClear = true;
    o.update();
    composer.render(clock.getDelta());
};

animate();

