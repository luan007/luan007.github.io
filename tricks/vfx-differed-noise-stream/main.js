var particles = [];
function setup() {
    createCanvas(window.innerWidth, window.innerHeight);

    while (particles.length < 1000) {
        particles.push({
            x: Math.random() * width, y: Math.random() * height, deg: 0, speed: 1, life: 1, vlife: 0
        });
    }

    background(0);
}

function render(v) {
    push();
    translate(v.x, v.y);
    fill(5, 2, 15);
    noStroke();
    rect(-1, 1, 2, 2);
    pop();
}

function rand(factor) {
    return (Math.random() - 0.5) * factor * 2;
}

var t = 0;

function draw() {
    t += 0.001;
    // fill(0, 10);
    // rect(0, 0, width, height);

    while (particles.length < 1000) {
        particles.push({
            x: Math.random() * 600, y: Math.random() * 600, deg: 0, speed: 1, life: 1, vlife: 0
        });
    }

    particles.forEach((v) => {
        v.life -= v.vlife * 0.1;
        var dx = Math.sin(v.deg) * v.speed;
        var dy = Math.cos(v.deg) * v.speed;
        v.deg = noise(v.x / 250, v.y / 250, t) * Math.PI * 6;
        v.x += dx;
        v.y += dy;
        if (v.x < 0 || v.x > width || v.y < 0 || v.y > height) v.life = -1;
    });
    blendMode(ADD);
    particles = particles.filter((v) => { return v.life > 0 });
    particles.forEach((v) => {
        render(v);
    });

    blendMode(BLEND);
}