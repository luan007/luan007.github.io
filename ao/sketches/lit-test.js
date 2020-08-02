import * as ao from "./libao";
import { three, vue, loop } from "./libao";
import { h_onchange, meta, m_color, m_number, proxy_three_color, m_bool } from "./libao/buildr/lite";


var { renderer, canvas } = ao.threeRenderer({ dpi: 2 });

ao.threePerspectiveCamera();
var scene = ao.threeScene();

ao.threeOrbitControl({});

scene.add(new three.AmbientLight(0xffff33, 0.5))

var mat = new three.MeshStandardMaterial({ opacity: 0.5, transparent: true, color: 0xffffff });
var _meta = {
    ...m_number("opacity", { min: 0, max: 1, step: 0.01 }),
    ...m_color("baseColor", proxy_three_color("color")),
    ...m_color("emissiveColor", proxy_three_color("emissive")),
    ...m_number("emissiveIntensity", { min: 0, max: 1, step: 0.01 }),
};

var box = new three.Mesh(new three.BoxGeometry(1, 1, 1), mat);
scene.add(box);

ao.threeLoop();
ao.looperStart();

document.body.appendChild(canvas);

ao.buildr.lite.prep();
ao.buildr.lite.inspect(mat, "basic_mat", _meta);