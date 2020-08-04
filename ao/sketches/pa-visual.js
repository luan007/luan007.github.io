import * as ao from "./libao";
import { three, vue, loop, threeFXToneMappingEffect, threeLocalToWorldNoModify } from "./libao";
import { m_number, proxy_ao_eased, m_bool, inspect } from "./libao/buildr/lite";
import { Water } from './libao/node_modules/three/examples/jsm/objects/Water2';
import { LightProbeGenerator } from './libao/node_modules/three/examples/jsm/lights/LightProbeGenerator';
// import { h_onchange, meta, m_color, m_number, proxy_three_color, m_bool } from "./libao/buildr/lite";
import { Reflector } from "./libao/fx/patch/ReflectorWithDepth";
import { lite } from "./libao/buildr";



// ao.threePatchPCSS_Shadow({}); //全局高级阴影

ao.buildr.lite.prep();
var { renderer, canvas } = ao.threeRenderer({
    dpi: 2, antialias: true,
    ...ao.threeRendererCfg_HighPerf_PostFX
});


var pmremGenerator = new three.PMREMGenerator(renderer);
var pngCubeRenderTarget, pngBackground;
pmremGenerator.compileEquirectangularShader();

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
        strength: 0.4,
        radius: 1,
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

var floor_stage = ao.eased(0, 0, 0.05, 0.0001);

var camera_2 = ao.threePerspectiveCamera(120);
var camera_1 = ao.threePerspectiveCamera(50);
var camera = ao.threePerspectiveCamera(90);
console.log(camera);

camera_2.updateProjectionMatrix();
camera.updateProjectionMatrix();
var mat2 = camera_2.projectionMatrix;
var mat1 = camera.projectionMatrix;

loop(() => {
    // camera.position.z = floor_stage.value * 10;
    camera.rotation.z = 1 - floor_stage.value;
    ao.threeEaseCameraProjection(camera,
        floor_stage.to == 1 ? camera_1 : camera_2
        , 0.05, 0.0001);
})
var scene = ao.threeScene();
// ao.threeOrbitControl({});

scene.add(camera);
camera.position.set(0, 0, 10);

// scene.add(new three.AmbientLight(0xffffff, 1))
var complex = new three.Group();
var testMat = new three.MeshStandardMaterial({ color: 0xffffff, roughness: 0, metalness: 0.9, wireframe: true, emissive: 0x003356, emissiveIntensity: 10 })

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

function stage_floor_test() {
    var floor = new three.PlaneBufferGeometry(50, 50);
    var refl = new Reflector(floor, {
        color: 0xffffff
    })
    refl.cameraFar = 3;
    refl.position.y = -3;
    refl.rotation.x = Math.PI * - 0.5;
    scene.add(refl);
}


function build_light_probe() {
    var grp = new three.Group();
    var cubeTarget = new three.WebGLCubeRenderTarget(32);
    var cubeCam = new three.CubeCamera(0.1, 300, cubeTarget);
    var lp = new three.LightProbe();
    grp.add(lp);

    loop(() => {
        cubeCam.update(renderer, scene);
        lp.copy(LightProbeGenerator.fromCubeRenderTarget(renderer, cubeTarget));
        lp.intensity = 3;
    });

    return grp;
}

//idea:

//stage ceiling - the link

//[virtual stage] 

function build_blinky_lights() {
    var group = new three.Group();
    var tiny_plate = new three.BoxGeometry(0.5, 0.05, 0.01);
    var splits = 30;
    for (var i = 0; i < splits; i++) {
        (() => {
            var plate_mat = new three.MeshStandardMaterial({
                emissive: 0xf3f2ff,
                emissiveIntensity: Math.random() * 2,
                side: three.DoubleSide,
                envMap: pngCubeRenderTarget.texture,
                roughness: 0.6,
                metalness: 0.6
            });
            var tiny_mesh = new three.Mesh(tiny_plate, plate_mat);
            var grp = new three.Group();
            grp.rotation.y = (Math.random() - 0.5) * Math.PI * 4;
            grp.add(tiny_mesh);
            tiny_mesh.position.z = ao.rrand(-0.1, -10);
            tiny_mesh.position.y = ao.rrand(-1, 1);
            group.add(grp);
        })()
    }
    return group;
}

var scene_mode = {
    show_floor: true,
    ...m_bool("show_floor")
};

loop(() => {
    floor_stage.to = scene_mode.show_floor ? 1 : 0;
});

inspect(scene_mode, "scene");

function build_display() {
    var screens = new three.Group();
    var curved_stage = new three.CylinderGeometry(10, 10, 5, 150, 1, true, Math.PI / 2, Math.PI);
    var led = new three.TextureLoader().load("particles.jpg");
    led.wrapS = three.RepeatWrapping
    led.repeat = new three.Vector2(-1, 1);

    var offset_y = ao.eased(0, 0, 0.1, 0.0001);
    var screenMat = new three.MeshBasicMaterial({
        color: 0xaaaaaa,
        map: led,
        side: three.BackSide
    });
    var screen_large = new three.Mesh(curved_stage, screenMat);

    loop(() => {
        led.offset.x += 0.001;
        offset_y.to = floor_stage.value;

        screens.rotation.y = (1 - floor_stage.value) * -0.3;
        screens.position.y = -(1 - offset_y.value) * 4;
        var a = Math.random() < floor_stage.value ? 0.8 : 0.01;
        screenMat.color.setRGB(a, a, a);
        screen_large.visible = floor_stage.value > 0.3;
    });

    screens.add(screen_large);

    return screens;
}

function build_floor() {
    var waterGeometry = new three.PlaneBufferGeometry(50, 50);
    var water = new Water(waterGeometry, {
        color: 0x070707,
        scale: 1.2,
        flowDirection: new three.Vector2(0, 0),
        textureWidth: 1024,
        textureHeight: 1024,
        reflectivity: 2
    });
    water.position.y = -3;
    water.rotation.x = Math.PI * - 0.5;
    loop(() => {
        water.visible = floor_stage.to == 1
    });
    return water;
}

function build_ring() {
    var group = new three.Group();
    var ringGeo = new three.TorusGeometry(2, 0.01, 10, 100, Math.PI * 2)
    var ringMat = new three.MeshBasicMaterial({
        color: 0xffffff
    });
    var mesh = new three.Mesh(ringGeo, ringMat);
    mesh.rotation.x = Math.PI / 2;
    mesh.position.y = -2;
    group.add(mesh);
    loop(() => {
        var s = floor_stage.value;
        mesh.scale.set(s,s,s);
        group.visible = Math.random() < floor_stage.value;
    })
    return group;
}

function build_dome() {
    var group = new three.Group();
    [[100, 65, 0.01]].forEach((v) => {
        var stage_sphere_geo = new three.SphereGeometry(v[0], v[1], v[1]);
        var mat_stage_sphere = new three.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: v[2],
            side: three.BackSide,
            wireframe: true
        });
        var ms = new three.Mesh(stage_sphere_geo, mat_stage_sphere);
        group.add(ms);
    })
    loop(() => {
        group.visible = Math.random() < floor_stage.value;
    })
    return group;
}

// stage.add(dome());

function build_tiny_topography() {
    var group = new three.Group();
    var step = 0.05;
    var scaler = 2;
    var points = new three.Geometry();
    for (var x = -1; x < 1; x += step) {
        for (var y = -1; y < 1; y += step) {
            if (Math.sqrt(x * x + y * y) > 1) continue;
            var z = ao.map(ao.n3d(x * 2, y * 2, 0.6), -0.5, 0.5, 0, 1);
            var r = 1;
            if (z < 0.8) {
                r = 0.2;
            }
            else if (z < 0.4) {
                r = 0.1;
            }
            points.vertices.push(new three.Vector3(
                x * scaler,
                z * 0.8,
                y * scaler
            ));
            points.colors.push(new three.Color(
                0.8, 0.4, 0.2
            ));
        }
    }
    var mat = new three.PointsMaterial({
        sizeAttenuation: true,
        size: 0.05,
        color: 0xffffff,
        transparent: true,
        blending: three.AdditiveBlending,
        vertexColors: three.VertexColors
    });
    var mesh = new three.Points(points, mat);
    group.add(mesh);

    loop(() => {
        var r = floor_stage.value;;
        group.scale.set(r, r, r);
        mat.opacity = r;
        group.rotation.y = -2 + 2 * floor_stage.value;
        group.position.y = -2 + 0.5 * floor_stage.value;
        // group.visible = Math.random() < floor_stage.value
    })

    return group;
}

function build_topography() {
    var group = new three.Group();
    var step = 0.02;
    var scaler = 20;
    var points = new three.Geometry();
    var _max = 0.4;
    var point_cache = [];
    for (var x = -1; x < 1; x += step) {
        for (var y = -1; y < 1; y += step) {
            var r = Math.max(0, _max - Math.sqrt(x * x + y * y)) / _max * 0.3;
            points.vertices.push(new three.Vector3(
                x * scaler,
                0,
                y * scaler
            ));
            points.colors.push(new three.Color(r, r, r));
            point_cache.push(r);
        }
    }
    var mat = new three.PointsMaterial({
        sizeAttenuation: false,
        size: 1,
        color: 0xfeaa33,
        opacity: 2,
        transparent: true,
        vertexColors: three.VertexColors
    });
    var mesh = new three.Points(points, mat);
    group.add(mesh);
    group.position.y = -2.5;
    loop(() => {
        mat.opacity = floor_stage.value;
        for (var i = 0; i < point_cache.length; i++) {
            // var s = floor_stage.value * (point_cache[i] + (1 - floor_stage.value) * 5 * Math.sin(point_cache[i] * 3 + 6 * floor_stage.value));
            // points.colors[i].setRGB(s, s, s);
        }
        points.colorsNeedUpdate = true;
    });
    return group;
}

function build_stars() {
    var group = new three.Group();
    var r = 50;
    var count = 1000;
    var points = new three.Geometry();
    for (var i = 0; i < count; i++) {
        var v = new three.Vector3(ao.rrand(-10, 10), ao.rrand(-10, 10), ao.rrand(-10, 10));
        v.normalize();
        v.multiplyScalar(ao.rrand(r, r * 5));
        points.vertices.push(v);
        var c = Math.random();
        points.colors.push(new three.Color(c, c, c));
    }
    var mat = new three.PointsMaterial({
        sizeAttenuation: true,
        size: 0.3,
        color: 0xffffff,
        vertexColors: three.VertexColors,
        opacity: 1.2,
        transparent: true,
    });
    var mesh = new three.Points(points, mat);
    group.add(mesh);
    loop(() => {
        group.rotation.x += 0.00006;
        group.rotation.y += 0.00003;
        // mat.opacity = (1 -  floor_stage.value) * 1.2;
        mesh.visible = Math.random() > floor_stage.value;
    })
    return group;
}

function build_stage() {
    var stage = new three.Group();

    var params = {
        show: true,
        ...m_bool("show", {}),
        contents: {

        }
    };
    var objs = {
        dome: build_dome(),
        display: build_display(),
        ring: build_ring(),
        floor: build_floor(),
        tiny_topo: build_tiny_topography(),
        topo: build_topography(),
        stars: build_stars(),
    };
    for (var i in objs) {
        params.contents[i] = true;
        params.contents = {
            ...m_bool(i, {}),
            ...params.contents
        };
        stage.add(objs[i]);
    }
    lite.inspect(params, "stage");
    loop(() => {
        stage.visible = params.show;
        // for (var i in objs) {
        // objs[i].visible = params.contents[i];
        // }
    });
    return stage;
}

function init() {
    scene.add(build_stage());
    // scene.fog = new three.FogExp2(0, 0.02);
}

(new three.TextureLoader()).load("./textures/env.jpg", (texture) => {
    pngCubeRenderTarget = pmremGenerator.fromEquirectangular(texture);
    pngBackground = pngCubeRenderTarget.texture;
    init();
});


//info ocean


//simulated ring (display) with (3d floating grids)

//the hologram

//sphere / the universe - VISUALIZER


ao.threeLoop();
ao.looperStart();
document.body.appendChild(canvas);



// window.mode = ao.eased(0, 0, 0.05, 0.00001);
// ao.loop(() => {
//     stage.visible = Math.random() < window.mode.value;
//     stage.rotation.y = (1 - window.mode.value) * Math.PI;
//     camera.position.y = (1 - window.mode.value) * 3 - 1;
//     camera.position.z = (10 - window.mode.value * 5);
// });

