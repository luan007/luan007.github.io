
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
window['global_width'] = window.innerWidth;
window['global_height'] = window.innerHeight;

var MAX_PARTICLES = 800;

var ratio = 1;

function setup() {
    init();
    requestAnimationFrame(update);
    window.addEventListener('resize', rescale);
    rescale();
}

function rescale() {
    global_width = window.innerWidth;
    global_height = window.innerHeight;
    ratio = window.devicePixelRatio || 1;
    ThreeResize();
    draw();
}

/* INIT */
function init() {
    ThreeInit();
    draw();
}

function draw() {
    ThreeDraw();
}

/* UPDATE */
function update() {
    updateParticles();
    ThreeUpdate();
    draw();
    return requestAnimationFrame(update);
}

window.addEventListener("load", setup);

//three stuff:

var scene, camera, renderer, threeCanvas;
var geometry, material, mesh;

function ThreeInit() {
    scene = new THREE.Scene();
    geometry = new THREE.Geometry();
    camera = new THREE.PerspectiveCamera(75, global_width / global_height, 1, 10000);
    material = new THREE.LineBasicMaterial({
        transparent: true, linewidth: 6,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
        // vertexColors: THREE.VertexColors
        color: 0x01a0ff,
    });
    geometry.vertices.push(new THREE.Vector3(0, 0, 0));
    geometry.vertices.push(new THREE.Vector3(100, 0, 0));
    mesh = new THREE.LineSegments(geometry, material);
    geometry.vertices = [];
    for (var i = 0; i < MAX_PARTICLES * 2; i++) {
        geometry.vertices.push(new THREE.Vector3());
    }
    scene.add(mesh);
    renderer = new THREE.WebGLRenderer({ antialiasing: true, alpha: true });
    threeCanvas = renderer.domElement;
    threeCanvas.classList.add("threeCanvas");
    document.body.appendChild(threeCanvas);
    ThreeResize();
}

function ThreeResize() {
    camera.position.z = 1000;
    camera.aspect = global_width / global_height;
    camera.updateProjectionMatrix();
    renderer.setSize(global_width, global_height);
    renderer.setPixelRatio(ratio);
}

function ThreeDraw() {
    renderer.render(scene, camera);
}

function ThreeUpdate() {
    // return;

}



var _list = [];

var fx = 0;
var fy = 0;

function distSQ(x, y, a, b) {
    return (x - a) * (x - a) + (y - b) * (y - b);
}

var _tt = 0;
function particles(_t) {
    _tt += 0.01;
    var len = _list.length;
    var count = 0;
    for (var i = 0; i < len; i++) {
        var cur = _list.pop();
        if (cur.x > global_width / 1.9 || cur.x < -global_width / 1.9 || cur.y > global_height / 1.9) {
            continue;
        }

        var dx = cur.x - fx;
        var dy = cur.y - fy;
        var rsq = distSQ(cur.x, cur.y, fx, fy) + (Math.sin(_tt * 1) + 1) * 50000;
        var r = Math.sqrt(rsq);
        var f = Math.max(-2, -50000 * (Math.sin(_tt * 1) + 0.5) / (rsq + 100));
        var _ax = dx / r * f;
        var _ay = dy / r * f;

        cur.ax = _ax;
        cur.ay = _ay;


        cur.vx += cur.ax * _t;
        cur.vy += cur.ay * _t;
        cur.v = Math.sqrt(cur.vx * cur.vx + cur.vy * cur.vy);
        var vlimit = Math.min(cur.v, 8);
        if (vlimit < cur.v && Math.abs(cur.vx) > 0 && Math.abs(cur.vy) > 0) {
            var slopeX = cur.vx / cur.v;
            var slopeY = cur.vy / cur.v;
            cur.vx = slopeX * vlimit;
            cur.vy = slopeY * vlimit;
            cur.v = vlimit;
        }
        cur.prevX = cur.x;
        cur.prevY = cur.y;
        cur.x += cur.vx * _t;
        cur.y += cur.vy * _t;
        _list.unshift(cur);

        count++;

        geometry.vertices[(count - 1) * 2].x = cur.x;
        geometry.vertices[(count - 1) * 2].y = cur.y;
        geometry.vertices[(count - 1) * 2 + 1].x = cur.prevX;
        geometry.vertices[(count - 1) * 2 + 1].y = cur.prevY;
    }

    for (var i = count * 2; i < geometry.vertices.length; i++) {
        geometry.vertices[(i)].y = 10000;
        geometry.vertices[(i)].x = 10000;
    }

    // while(count * 2 < geometry.vertices.length) {
    //     geometry.vertices.pop();
    // }
    geometry.verticesNeedUpdate = true;

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
function updateParticles() {
    particles(1);
    for (var i = 0; i < 10 && _list.length < MAX_PARTICLES; i++) {
        spawn(global_width * (1 - Math.random() * 2), global_height * (1 - Math.random() * 2), Math.random() * 5, Math.random() * 5);
        // spawn(global_width * (1 - Math.random() * 2), -global_height + 100, 0, Math.random() + 3);
    }
}