var canvas = document.createElement("canvas");
document.body.appendChild(canvas);
canvas.width = canvas.height = 600 * devicePixelRatio;
canvas.style.width = canvas.style.height = 600;
canvas.style.border= "2px solid black"
var ctx = canvas.getContext('2d');
var PI = Math.PI;
var t = 0;

function field() {
    var step = 1 / 30;
    for (var x = -1; x <= 1; x += step) {
        for (var y = -1; y <= 1; y += step) {
            var nz = Math.abs(noise.perlin3(x, y, t));
            ctx.fillStyle = "rgba(255,255,255,0.5)"
            var sz = nz
            var _x = (x + step / 2) * 300 - sz / 2
            var _y = (y + step / 2) * 300 - sz / 2
            ctx.fillRect(_x, _y, sz, sz);
        }
    }
}

var _list = [];
function particles(_t) {
    var len = _list.length;
    for (var i = 0; i < len; i++) {
        var cur = _list.pop();
        if (cur.x > 300 || cur.x < -300 || cur.y > 300 || cur.y < -300) {
            continue;
        }
        cur.ax = noise.perlin3(cur.x / 300, cur.y / 300, t) * 3;
        cur.ay = noise.perlin3(cur.y / 300, cur.x / 300, -t) * 3;
        cur.vx += cur.ax * _t;
        cur.vy += cur.ay * _t;
        cur.prevX = cur.x;
        cur.prevY = cur.y;
        cur.x += cur.vx * _t;
        cur.y += cur.vy * _t;
        cur.v = Math.sqrt(cur.vx * cur.vx * + cur.vy * cur.vy) / 100 ;
        ctx.lineWidth = cur.v * 7 + 1;
        ctx.strokeStyle = "rgba(30, 150, 200, 1)"
        // ctx.strokeStyle = "rgba(" + cur.v * 200 + ", 150,255, " + Math.max(0.4, 1 - cur.v / 2) * 0.8 + ")";
        ctx.beginPath();
        ctx.moveTo(cur.prevX, cur.prevY);
        ctx.lineTo(cur.x, cur.y);
        ctx.closePath();
        ctx.stroke();
        _list.unshift(cur);
    }
}

function spawn(x, y, vx, vy) {
    _list.push({
        x: x,
        y: y,
        vx: vx,
        vy: vy,
        prevX: x,
        prevY: y,
        ax: 0,
        ay: 0
    });
}

(function raf() {
    t += 0.02;

    ctx.save();
    ctx.scale(devicePixelRatio, devicePixelRatio);
    ctx.globalCompositeOperation = "source-over"
    ctx.fillStyle = "rgba(255,255,255, 0.05)";
    ctx.fillRect(0, 0, 600, 600);
    ctx.translate(300, 300);
    ctx.globalCompositeOperation = "multiply"
    //field();
    particles(0.3);
    for (var i = 0; i < 10 && _list.length < 600; i++) {
        spawn(600 * (Math.random() - 0.5), 600 * (Math.random() - 0.5), Math.random() - 0.5, Math.random() - 0.5);
    }
    ctx.restore();
    requestAnimationFrame(raf);
})();