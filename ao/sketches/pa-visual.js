import * as ao from "./libao";
import { three, vue, loop } from "./libao";
ao.threePatchPCSS_Shadow({}); //全局高级阴影
var { renderer, canvas } = ao.threeRenderer({
    clearColor: 0,
    ...ao.threeRendererCfg_HighPerf_PostFX //高性能配置
});
var scene = ao.threeScene();
var cam = ao.threePerspectiveCamera(50);
ao.threeAutoColorMGMT() //颜色管理预设
ao.threeFXComposer({});   //启用后期
ao.threeFXNormalPass(); //Normal渲染
ao.threeFXEffectPass([
    ao.threeFXSSAOEffect({  //SSAO效果
        ...ao.threeFXSSAOEffect_PRESETS.DBG //预设
    }),
    ao.threeFXSSAOEffect({  //SSAO效果
        ...ao.threeFXSSAOEffect_PRESETS.DustEverywhere, //预设
        color: new three.Color(1, 1, 0),
        blendFunction: ao.postprocessing.BlendFunction.SUBTRACT
    })
]);
// ao.threeFXUnrealPass({  //Unreal辉光渲染 (HDR)
//     threshold: 1        //大于1的像素才会发光，证明全局HDR被支持
// });
// ao.threeFXFilmPass({}); //胶片后期

ao.threeOrbitControl({  //控制
    camPos: new three.Vector3(0, 0, 10)
});
var grp = new three.Group();
grp.position.z = 0;
for (var i = 0; i < 30; i++) {
    var mesh = new three.Mesh(
        new three.BoxGeometry(1, 1, 1),
        new three.MeshStandardMaterial({
            emissive: 0xffffff,
            emissiveIntensity: Math.random() * 2
        })
    );
    mesh.position.set(
        ao.rrand(-5, 5),
        ao.rrand(-5, 5),
        ao.rrand(-5, 5)
    );
    ((m) => {
        var y = ao.rrand(-5, 5);
        var spd = Math.random();
        loop((t) => {
            m.position.y = y + Math.sin(t * spd * 0.2) * 2;
        });
    })(mesh);
    grp.add(mesh);
}
scene.add(grp);
loop(() => {
    grp.rotation.x += 0.001;
    grp.rotation.y += 0.006;
});
ao.threeLoop();
ao.looperStart();
window.document.body.appendChild(canvas);