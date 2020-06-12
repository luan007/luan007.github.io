// import * as util from "./util";

function loop(c) {
    loop.l = loop.l || [];
    loop.l.push(c);
}
function loop_start() {
    function _loop() {
        loop.l = loop.l || [];
        loop.l.forEach(c => c());
        requestAnimationFrame(_loop);
    }
    _loop();
}

var canvas_list = {};
var w, h, dpi, time = 0;

function create_canvas(name, append_to_dom) {
    canvas_list[name] = document.createElement("canvas");
    canvas_list[name].name = name;
    append_to_dom && document.getElementById("canvas-holder").appendChild(canvas_list[name]);
    canvas_list[name].ctx = canvas_list[name].getContext('2d');
}

function beginDPI() {
    for (var i in canvas_list) {
        canvas_list[i].ctx.save();
        canvas_list[i].ctx.scale(dpi, dpi);
    }
}
function endDPI() {
    for (var i in canvas_list) {
        canvas_list[i].ctx.restore();
    }
}


function get_ctx(name) {
    return canvas_list[name].ctx;
}

function get_canvas(name) {
    return canvas_list[name];
}

function resize() {
    dpi = 2;
    w = window.innerWidth;
    h = window.innerHeight;
    for (var i in canvas_list) {
        canvas_list[i].width = w * dpi;
        canvas_list[i].height = h * dpi;
    }
}

window.onload = function () {
    init();
}

window.onresize = function () {
    resize();
}

function init() {
    create_canvas("main", true);
    create_canvas("fbo", false);
    resize();
    loop_start();
}

var blocks = [];

var frames = 0;
function draw_qiantou_bg() {
    let ctx = get_ctx('fbo');
    ctx.clearRect(0, 0, 10000, 10000);
    ctx.drawImage(get_canvas('main'), 0, 0, w, h)
    if (frames % 1 == 0) {
        ctx.fillStyle = "rgba(255,255,255,0.01)";
        ctx.fillRect(0, 0, w, h);
    }
    ctx.fillStyle = "black";
    let sz = (Math.sin(time * 5) * 0.5 + 0.5) * 5 + 5;
    // ctx.save();
    // ctx.translate(w / 2, h / 2);
    // ctx.rotate(time);
    // ctx.fillRect(-sz / 2, -sz / 2, sz, sz);
    // ctx.restore();
    // var scale_up = 1.0005;


    if (Math.random() > 0.95) {
        do {
            var gen = {
                mode: 1, //Math.random() > 0.5 ? 1: 0,
                x: Math.random(),
                y: Math.random(),
                vx: Math.random() - 0.5,
                vy: Math.random() - 0.5,
                rot: 0,
                rot_spd: (Math.random() - 0.5) * 0.01,
                life: 1,
                vl: Math.random() * 0.05 + 0.1,
                sz: Math.random() * 5 + 1
            };
            var x = gen.x;
            var y = gen.y;
        } while (Math.sqrt((x - 0.5) * (x - 0.5) + (y - 0.5) * (y - 0.5)) < 0.4);
        blocks.push(gen);
    }

    blocks.forEach((v) => {
        ctx.save();
        ctx.translate(v.x * w, v.y * h);
        ctx.fillStyle = v.mode == 0 ? "white" : "black";
        var curve = 1 - Math.pow(2 * v.life - 1, 8);
        var sz = v.sz * curve * (v.mode == 0 ? 10 : 1);
        v.rot += v.rot_spd;
        v.x += v.vx * 0.001;
        v.y += v.vy * 0.001;
        ctx.rotate(v.rot);
        ctx.fillRect(- sz / 2, - sz / 2, sz, sz);
        ctx.restore();
        v.life -= v.vl * 0.05;
    });
    blocks = blocks.filter(b => b.life > 0);


    var scale_up = 1.001;
    ctx = get_ctx('main');
    ctx.clearRect(0, 0, 10000, 10000);
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate(0.005);
    // ctx.globalAlpha = 0.99;
    ctx.drawImage(get_canvas('fbo'), -w * scale_up / 2, -h * scale_up / 2, w * scale_up, h * scale_up)
    ctx.restore();
}

loop(() => {
    frames += 1;
    time += 0.01;
    beginDPI();
    draw_qiantou_bg();
    endDPI();
});