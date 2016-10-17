var canvas = document.createElement("canvas");
document.body.appendChild(canvas);
canvas.width = canvas.height = 600 * devicePixelRatio;
canvas.style.width = canvas.style.height = 600;
var ctx = canvas.getContext('2d');
var PI = Math.PI;
function lerp(a, b, p) { return a + (b - a) * p; }
var ring_lerp = new Array(5);
var t = 0;
function ring() {
    var step = PI * 2 / 20;
    var first = true;
    ctx.strokeStyle = "rgba(50, 150, 200, 0.2)";
    for (var i = 0; i < PI * 2; i += step) {
        var d = 100 + 15 * Math.sin(i * 15 + t * 10);
        var d2 = 100 + 17 * Math.cos(i * 17 + t * 10);
        for (var q = 0; q < ring_lerp.length; q++) {
            var cur = lerp(d, d2, q / ring_lerp.length);
            var prev = ring_lerp[q];
            //draw
            ctx.beginPath();
            ctx.moveTo(cur * Math.sin(i + t), cur * Math.cos(i + t));
            ctx.lineTo(prev * Math.sin(i + t - step), prev * Math.cos(i + t - step));
            ctx.stroke();
            ctx.closePath();
            ring_lerp[q] = cur;
        }
    }
}
(function raf() {
    t += 0.01;
    ctx.save();
    ctx.scale(devicePixelRatio, devicePixelRatio);
    ctx.globalCompositeOperation = "source-over"
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, 0, 600, 600);
    ctx.translate(300, 300);
    ctx.globalCompositeOperation = "lighter"
    ring();
    ctx.restore();
    requestAnimationFrame(raf);
})();