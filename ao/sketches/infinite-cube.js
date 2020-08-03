import * as ao from "./libao";
import { three, vue, loop, threeFXToneMappingEffect } from "./libao";
import { m_number, proxy_ao_eased } from "./libao/buildr/lite";
import { Water } from './libao/node_modules/three/examples/jsm/objects/Water2';
import { ReflectorRTT } from './libao/node_modules/three/examples/jsm/objects/ReflectorRTT';
// import { h_onchange, meta, m_color, m_number, proxy_three_color, m_bool } from "./libao/buildr/lite";

ao.threePatchPCSS_Shadow({}); //全局高级阴影


ao.buildr.lite.prep();
var { renderer, canvas } = ao.threeRenderer({ dpi: 2 });

ao.threeAutoColorMGMT(false)

ao.threeFXSMAAEffect_GetImages().then(() => {
    ao.threeFXComposer({});
    // ao.threeFXNormalPass({ resolutionScale: 1 });
    ao.threeFXEffectPass([
        ao.threeFXSMAAEffect({})
    ]);
    // ao.threeFXFilmPass({}); //胶片后期
    ao.threeFXUnrealPass({  //Unreal辉光渲染 (HDR)
        threshold: 1,
        strength: 0.5,
        radius: 0.2,
        unifiedFactor: .5
    });
    ao.threeFXEffectPass([
        // threeFXToneMappingEffect(),
        new ao.postprocessing.GammaCorrectionEffect({ gamma: 2 })
    ]);
    // ao.threeFXEffectPass([
    //     ao.threeFXSSAOEffect(ao.threeFXSSAOEffect_PRESETS.Fast_SSAO_Detail)
    //     // ao.threeFXSSAOEffect(ao.threeFXSSAOEffect_PRESETS.Fast_SSAO)
    //     // ao.threeFXSSAOEffect({  //SSAO效果
    //     //     ...ao.threeFXSSAOEffect_PRESETS.DustEverywhere, //预设
    //     //     color: new three.Color(1, 1, 0),
    //     //     blendFunction: ao.postprocessing.BlendFunction.SUBTRACT
    //     // }),
    // ]);
})


var camera = ao.threePerspectiveCamera(90);
var scene = ao.threeScene();
ao.threeOrbitControl({});

// scene.add(new three.AmbientLight(0xffffff, 1))
var complex = new three.Group();
var testMat = new three.MeshStandardMaterial({ color: 0xffffff, roughness: 0, metalness: 0.9, wireframe: true, emissive: 0x003356, emissiveIntensity: 10 })

var dirlight = new three.DirectionalLight(0xffffff, 1);
dirlight.position.set(0, 0, 10)
scene.add(dirlight);

// var sphere = new three.Mesh(new three.SphereGeometry(1, 100, 100), new three.MeshStandardMaterial({ color: 0xffffff }))
// sphere.position.y = -1 - 0.02;
// complex.add(sphere);


// var sphere2 = new three.Mesh(new three.SphereGeometry(1, 100, 100), new three.MeshStandardMaterial({ color: 0xffffff }))
// sphere2.position.y = 1 + 0.02;
// complex.add(sphere2);

function init_spiral_rings() {
    var control = {
        rotX: ao.eased(0, 0, 0.1, 0.0001),
        rotZ: ao.eased(0, 0, 0.1, 0.0001),
        ...m_number("rot_x", {
            min: 0, max: 3, step: 0.01,
            ...proxy_ao_eased("rotX")
        }),
        ...m_number("rot_z", {
            min: 0, max: 3, step: 0.01,
            ...proxy_ao_eased("rotZ")
        })
    };

    var testGeo = new three.BoxGeometry(0.4, 0.01, 0.4);
    for (var deg = 0; deg < Math.PI * 2; deg += 0.05) {
        ((deg) => {
            var mesh = new three.Mesh(testGeo, testMat);
            var transformGrp = new three.Group();
            transformGrp.rotation.z = deg;
            transformGrp.add(mesh);

            loop((t) => {
                mesh.rotation.x = deg * 2 + t / 2
                mesh.rotation.z = Math.PI / 2;
            })
            mesh.position.y = 1;
            complex.add(transformGrp);
        })(deg);
    }
    complex.rotation.x = Math.random();
    complex.rotation.z = Math.random();
    scene.add(complex);
    ao.buildr.lite.inspect(control, 'control');
}

// init_spiral_rings();


//idea:

//stage ceiling - the link

//[virtual stage] 

var curved_stage = new three.CylinderGeometry(10, 10, 5, 150, 1, true, Math.PI / 2, Math.PI);
var led = new three.TextureLoader().load("led-2.jpg");
led.wrapS = three.RepeatWrapping
led.repeat = new three.Vector2(-1, 1);
var screenMat = new three.MeshBasicMaterial({
    color: 0xaaaaaa,
    // map: led,
    side: three.BackSide
});

var screen_large = new three.Mesh(curved_stage, screenMat);
var screens = new three.Group();
screens.add(screen_large);

var tiny_plate = new three.PlaneBufferGeometry(1, 0.6);
var splits = 130;
for (var i = 0; i < splits; i++) {
    (() => {
        var plate_mat = new three.MeshStandardMaterial({
            emissive: 0x333333,
            opacity: Math.random(),
            transparent: true,
            blending: three.AdditiveBlending,
        });
        var tiny_mesh = new three.Mesh(tiny_plate, plate_mat);
        var grp = new three.Group();
        grp.rotation.y = (Math.random() - 0.5) * Math.PI;
        grp.add(tiny_mesh);
        tiny_mesh.position.z = ao.rrand(-5, -10);
        tiny_mesh.position.y = ao.rrand(-2, 2);
        // screens.add(grp);
    })()
}

scene.add(screens);

function stage_floor() {
    //stage floor
    var waterGeometry = new three.PlaneBufferGeometry(50, 50);

    // var water = new Reflector( waterGeometry, {
    //     textureWidth: 1024,
    //     textureHeight: 1024,
    //     encoding: three.sRGBEncoding
    // } );

    var water = new Water(waterGeometry, {
        color: 0x111111,
        scale: 0.8,
        flowDirection: new three.Vector2(0, 0),
        textureWidth: 1024,
        textureHeight: 1024,
        reflectivity: 2
    });

    water.position.y = -3;
    water.rotation.x = Math.PI * - 0.5;

    scene.add(water);
}

// var groundPlane = new three.PlaneBufferGeometry(50, 50);
// var groundMirror = new ReflectorRTT(groundPlane, { clipBias: 0.003, textureWidth: 1024, textureHeight: 1024 });
// groundMirror.position.y = -3;
// groundMirror.rotation.x = Math.PI * - 0.5;
// scene.add(groundMirror);
// var renderTarget = groundMirror.getRenderTarget();
// renderTarget.depthBuffer = true;
// renderTarget.depthTexture = new three.DepthTexture();
// renderTarget.depthTexture.type = three.UnsignedShortType;
// console.log(groundMirror.getRenderTarget().depthTexture)

var cubeTarget = new three.WebGLCubeRenderTarget(1024);
var cube = new three.CubeCamera(0, 1000, cubeTarget);

var testBoxGeo = new three.BoxGeometry(5, 5);
var testBoxMat = new three.MeshBasicMaterial({
    map: cubeTarget.texture
});

var box = new three.Mesh(testBoxGeo, testBoxMat);
scene.add(box);
scene.add(cube);
loop(() => {
    cube.update(renderer, scene);
});

//info ocean


//simulated ring (display) with (3d floating grids)

//the hologram

//sphere / the universe - VISUALIZER


ao.threeLoop();
ao.looperStart();


document.body.appendChild(canvas);