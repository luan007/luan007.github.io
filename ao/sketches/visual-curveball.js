import * as ao from "./libao";
import { three, vue, loop } from "./libao";
ao.threePatchPCSS_Shadow({}); //全局高级阴影
var { renderer, canvas } = ao.threeRenderer({
    // clearColor: 0x3582f9,
    clearColor: 0x333444,
    // clearColor: 0,
    ...ao.threeRendererCfg_HighPerf_PostFX //高性能配置
});
var scene = ao.threeScene();
var cam = ao.threePerspectiveCamera(50);
scene.add(new three.AmbientLight(0xffffff, 0.5))
var dirLight = new three.DirectionalLight(0xff3311, 3.0);
dirLight.castShadow = true;
dirLight.position.set(0, -20, -20);
scene.add(dirLight);
ao.threeAutoColorMGMT()

ao.threeFXSMAAEffect_GetImages().then(() => {
    ao.threeFXComposer({});
    ao.threeFXNormalPass({ resolutionScale: 1 });
    ao.threeFXEffectPass([
        ao.threeFXSMAAEffect({})
    ]);
    // ao.threeFXFilmPass({}); //胶片后期
    ao.threeFXUnrealPass({  //Unreal辉光渲染 (HDR)
        threshold: 0.8,
        strength: 0.8,
        radius: 0.3,
        unifiedFactor: .1
    });
    ao.threeFXEffectPass([
        ao.threeFXSSAOEffect(ao.threeFXSSAOEffect_PRESETS.Fast_SSAO_Detail)
        // ao.threeFXSSAOEffect(ao.threeFXSSAOEffect_PRESETS.Fast_SSAO)
        // ao.threeFXSSAOEffect({  //SSAO效果
        //     ...ao.threeFXSSAOEffect_PRESETS.DustEverywhere, //预设
        //     color: new three.Color(1, 1, 0),
        //     blendFunction: ao.postprocessing.BlendFunction.SUBTRACT
        // }),
    ]);
})


ao.threeOrbitControl({  //控制
    camPos: new three.Vector3(0, 0, 10)
});
var geo = new three.BoxGeometry(0.04, 0.04, 0.8);
var mat = new three.MeshStandardMaterial({
    emissive: 0xffffff,
    emissiveIntensity: 0,
    metalness: 0.5,
    roughness: 0.5
});
var instanced = new three.InstancedMesh(geo, mat, 3000);
instanced.castShadow = true;
instanced.receiveShadow = true;
var obj = new three.Object3D();
scene.add(instanced);
instanced.instanceMatrix.setUsage(three.DynamicDrawUsage);

var mat4 = new three.Matrix4();
for (var i = 0; i < 3000; i++) {
    obj.position.set(
        ao.rrand(-2, 2),
        ao.rrand(-2, 2),
        ao.rrand(-2, 2)
    );
    var [curlX, curlY, curlZ] = ao.curl3d(obj.position.x / 8, obj.position.y / 9, obj.position.z / 8);
    obj.rotation.set(
        curlX * Math.PI * 2, curlY * Math.PI * 2, curlZ * Math.PI * 2
    );
    obj.updateMatrix();
    instanced.setMatrixAt(i, obj.matrix);
}

loop((t) => {

    instanced.rotation.x += 0.001;
    instanced.rotation.y += 0.003;
    t *= 0.1;
    for (var i = 0; i < 3000; i++) {
        instanced.getMatrixAt(i, mat4);
        obj.position.setFromMatrixPosition(mat4);
        obj.setRotationFromMatrix(mat4);
        var [curlX, curlY, curlZ] = ao.curl3d(obj.position.x / 8 - t, obj.position.y / 9 + t, obj.position.z / 8 + t);
        obj.rotation.set(
            curlX * Math.PI * 2, curlY * Math.PI * 2, curlZ * Math.PI * 2
        );
        // obj.updateMatrix();
        obj.updateMatrix();
        instanced.setMatrixAt(i, obj.matrix);
    }
    instanced.needsUpdate = true;
    instanced.instanceMatrix.needsUpdate = true;

});

ao.threeLoop();
ao.looperStart();
window.document.body.appendChild(canvas);