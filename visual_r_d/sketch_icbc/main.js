import * as dat from "dat.gui";
const gui = new dat.GUI();
import * as three from "three";
window.THREE = three;
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

var clock = new THREE.Clock();
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer({
    powerPreference: "high-performance",
    antialias: true,
    stencil: false,
    depth: false
});
renderer.setClearColor(0xffffff);
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
var d = 10;
var plategeo = new THREE.BoxGeometry(1, 0.5, 1);

function build_plate(x, y, id) {
    var id = id;
    var offset = Math.random() * 0.1;
    var easing = Math.random() * 0.05 + 0.05;
    var target_pos = [x, offset, y];
    var target_dir = [0, 0, 0];
    var g = new three.Group();
    var material = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0.3, roughness: 0.8 });
    var cube = new THREE.Mesh(plategeo, material);
    cube.receiveShadow = true;

    loop(() => {
        if (window.state.scene == 1) {
            target_pos[0] = 0;
            target_pos[1] = offset;
            target_pos[2] = 0;
        }
        else if (window.state.scene == 2) {
            target_pos[0] = x;
            target_pos[1] = offset;
            target_pos[2] = y;

            if (Math.random() > 0.999) {
                offset = Math.random() * 0.2;
            }
        }
        else if (window.state.scene == 3) {
            var phase = Math.round(id / 3);
            var off = id / 10 + (Math.round(id / 3 + t) % 3) / 3;

            target_pos[0] = Math.sin(off + t) * 10;
            target_pos[1] = phase - 40;
            target_pos[2] = Math.cos(off + t) * 10;

            if ((phase % 3) == 2) {
                var temp = target_pos[0];
                target_pos[0] = target_pos[2];
                target_pos[2] = temp;
            }
            target_pos[1] *= 0.01;
            target_pos[1] = Math.pow(target_pos[1], 3) * 210;

            if (Math.random() > 0.999) {
                offset = Math.random() * 0.2;
            }
        }
        cube.position.x = ease(cube.position.x, target_pos[0], easing);
        cube.position.y = ease(cube.position.y, target_pos[1], easing);
        cube.position.z = ease(cube.position.z, target_pos[2], easing);
        cube.rotation.x = ease(cube.rotation.x, target_dir[0], easing);
        cube.rotation.y = ease(cube.rotation.y, target_dir[1], easing);
        cube.rotation.z = ease(cube.rotation.z, target_dir[2], easing);
    });

    g.add(cube);

    return g;
}

var id = 0;
for (var x = -d; x < d; x++) {
    for (var y = -d; y < d; y++) {
        grp.add(build_plate(x, y, id++));
    }
}


for (var i = 0; i < 30; i++) {
    var geometry = new THREE.SphereGeometry(0.2, 2, 2);
    var material = new THREE.MeshPhysicalMaterial({ flatShading: true, color: 0xffffff, metalness: 0.2, roughness: 0.1, wireframe: false, wireframeLinewidth: 2 });
    var materialWF = new THREE.MeshPhysicalMaterial({ flatShading: true, transparent: true, blending: three.MultiplyBlending,  opacity: 0.1, color: 0, metalness: 0.2, roughness: 0.1, wireframe: true });
    var cube = new THREE.Mesh(geometry, material);
    // cube.receiveShadow = true;
    // cube.castShadow = true;
    cube.position.set(Math.round((Math.random() - 0.5) * 20), 0.8, Math.round((Math.random() - 0.5) * 20));
    grp.add(cube);
    var cubeWF = new THREE.Mesh(geometry, materialWF);
    cubeWF.position.copy(cube.position);
    cubeWF.scale.set(1.2,1.2,1.2);
    grp.add(cubeWF);
}

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
    renderer.autoClear = true;
    o.update();
    composer.render(clock.getDelta());

};

animate();

