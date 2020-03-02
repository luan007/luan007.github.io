var bg;

var DPI = devicePixelRatio;
var DPIS = devicePixelRatio * devicePixelRatio;

function clamp(q) {
  q = q > 1 ? 1 : q;
  q = q < 0 ? 0 : q;
  return q;
}


function bg_ellipse() {
  bg.background(0);
  bg.noStroke();
  var s = abs(sin(millis() / 1000)) * 200 + 30;
  bg.push();
  bg.translate(mouseX, mouseY);
  // for (var i = 0; i < 50; i++) {
  //   bg.push();
  //   var q1 = noise(i / 10, millis() / 3000 + i / 10, millis() / 20200 + i / 40);
  //   var q2 = noise(i / 50, millis() / 3020 + i / 10, millis() / 12000 + i / 40);
  //   var ss = noise(i / 150 + 19, millis() / 3020 - i / 100, millis() / 10200 + i / 400);
  //   bg.translate(map(q1, 0, 1, -1230, 1230), map(q2, 0, 1, -1230, 1230));
  //   bg.scale(ss + 0.5);
  //   bg.fill(abs(sin((i * 100 + millis()) / 3000)) * 255, abs(cos((i * 100 + millis()) / 800)) * 255, abs(cos((i * 210 + millis()) / 500)) * 255);
  //   bg.rect(-s / 2, -s / 2, s, s);
  //   bg.pop();
  // }
  bg.fill(abs(sin(millis() / 3000)) * 255, abs(cos(millis() / 800)) * 255, abs(cos(millis() / 500)) * 255);
  bg.rotate(millis() / 500);
  bg.rect(-s / 2, -s / 2, s, s);
  bg.pop();

}

var stuff = [];

class updatable {
  constructor() {
    this.life = 0.0;
    this.vlife = 0.0;
    this.dead = false;
  }
  update(t, dt) {
    this.life += this.vlife * dt;
    this.life = this.lifet >= 1.0 ? 1.0 : this.life;
    this.dead = this.life >= 1.0;
  }
}

function single_ease(t, v, e) {
  v = v + (t - v) * e;
  if (Math.abs(t - v) < 0.00001) {
    return t;
  }
  return v;
}

function ease(target, value, ease) {
  for (var i = 0; i < target.length; i++) {
    value[i] = single_ease(target[i], value[i], ease);
  }
}

class mappingRGB extends updatable {
  constructor(x, y, size) {
    super();
    this.x = x;
    this.y = y;
    this.ease = 0.1;
    this.target = [0, 0, 0, 0];
    this.values = [0, 0, 0, 0];
    this.size = size;
  }
  update(t, dt) {
    super.update(t, dt);
    if (this.dead) return;
    // var col = bg.get(this.x, this.y);
    var r = bg.pixels[(this.x * DPI + this.y * DPIS * bg.width) * 4];
    var g = bg.pixels[(this.x * DPI + this.y * DPIS * bg.width) * 4 + 1];
    var b = bg.pixels[(this.x * DPI + this.y * DPIS * bg.width) * 4 + 2];
    var a = bg.pixels[(this.x * DPI + this.y * DPIS * bg.width) * 4 + 3];
    this.target = [r, g, b, a];
    ease(this.target, this.values, this.ease);
    fill(255, 255, 255, 255 * this.values[0] / 255);
    rect(this.x, this.y, this.size / 3 - 1, this.size * this.values[0] / 255 / 255 * this.values[3] - 1);
    fill(255, 255, 255, 255 * this.values[1] / 255);
    rect(this.x + this.size / 3, this.y, this.size / 3 - 1, this.size * this.values[1] / 255 / 255 * this.values[3] - 1);
    fill(255, 255, 255, 255 * this.values[2] / 255);
    rect(this.x + this.size / 3 * 2, this.y, this.size / 3 - 1, this.size * this.values[2] / 255 / 255 * this.values[3] - 1);
    fill(255, 255, 255);
  }
}

class walkingColors extends updatable {
  constructor(x, y, size) {
    super();
    this.x = x;
    this.y = y;
    this.ease = 0.1;
    this.target = [0, 0, 0, 0];
    this.values = [0, 0, 0, 0];
    this.size = size;
  }
  update(t, dt) {
    super.update(t, dt);
    if (this.dead) return;
    // var col = bg.get(this.x, this.y);
    var r = bg.pixels[(this.x * DPI + this.y * DPIS * bg.width) * 4];
    var g = bg.pixels[(this.x * DPI + this.y * DPIS * bg.width) * 4 + 1];
    var b = bg.pixels[(this.x * DPI + this.y * DPIS * bg.width) * 4 + 2];
    var a = bg.pixels[(this.x * DPI + this.y * DPIS * bg.width) * 4 + 3];
    this.target = [r, g, b, a];
    ease(this.target, this.values, this.ease);
    fill(255, 255, 255, 255 * this.values[0] / 255);
    rect(this.x, this.y, this.size / 3 - 1, this.size * this.values[0] / 255 / 255 * this.values[3] - 1);
  }
}

class seperatorsRGB extends updatable {
  constructor(x, mx, y, size, layer) {
    super();
    this.x = x;
    this.mx = mx;
    this.midx = Math.floor((x + mx) / 2);
    this.xlen = Math.abs(this.x - this.mx);
    this.y = y;
    this.ease = 0.5;
    this.target = [0, 0, 0, 0];
    this.visible = 1;
    this.values = [0, 0, 0, 0];
    this.size = size;
    this.children = [];
    this.layer = layer;
    if (layer < 6) {
      var l = new seperatorsRGB(this.x, this.midx, y, size, layer + 1);
      var r = new seperatorsRGB(this.midx, this.mx, y, size, layer + 1);
      stuff.push(l);
      stuff.push(r);
      this.children.push(l);
      this.children.push(r);
    }
  }

  gc(x) {
    var r = bg.pixels[(x * DPI + this.y * DPIS * bg.width) * 4];
    var g = bg.pixels[(x * DPI + this.y * DPIS * bg.width) * 4 + 1];
    var b = bg.pixels[(x * DPI + this.y * DPIS * bg.width) * 4 + 2];
    var a = bg.pixels[(x * DPI + this.y * DPIS * bg.width) * 4 + 3];
    return (r + g + b + a) / 4;
  }

  getColor(x, to) {
    var avg = 0;
    var q = 0;
    for(var i = x; i <= to; i++) {
      avg += this.gc(i);
      q++;
    }
    return avg / q;
  }

  update(t, dt) {
    super.update(t, dt);
    if (this.dead) return;
    // var col = bg.get(this.x, this.y);
    var r = bg.pixels[(this.midx * DPI + this.y * DPIS * bg.width) * 4];
    var g = bg.pixels[(this.midx * DPI + this.y * DPIS * bg.width) * 4 + 1];
    var b = bg.pixels[(this.midx * DPI + this.y * DPIS * bg.width) * 4 + 2];
    var a = bg.pixels[(this.midx * DPI + this.y * DPIS * bg.width) * 4 + 3];

    if(this.layer != 0 && this.visible == 0) return;
    if (Math.abs(this.getColor(this.x, this.midx) - this.getColor(this.midx, this.mx) > 1)) {
      this.visible = 0;
      if (this.children.length > 0) {
        this.children[0].visible = 1;
        this.children[1].visible = 1;
      }
    } else {
      this.visible = 1;
      if (this.children.length > 0) {
        this.children[0].visible = 0;
        this.children[1].visible = 0;
      }
    }

    this.target = [r * this.visible, g * this.visible, b * this.visible, a * this.visible];
    ease(this.target, this.values, this.ease);
    if (this.target[0] > 50) {
      fill(255);
      rect(this.x + 1, this.y + 1, (this.xlen - 2) * this.values[1] / 255, this.size - 2);
    }
  }
}

class lrRGB extends updatable {
  constructor(x, y, size) {
    super();
    this.x = x;
    this.y = y;
    this.ease = 0.1;
    this.target = [0, 0, 0, 0];
    this.values = [0, 0, 0, 0];
    this.size = size;
  }
  update(t, dt) {
    super.update(t, dt);
    if (this.dead) return;
    // var col = bg.get(this.x, this.y);
    var r = bg.pixels[(this.x * DPI + this.y * DPIS * bg.width) * 4];
    var g = bg.pixels[(this.x * DPI + this.y * DPIS * bg.width) * 4 + 1];
    var b = bg.pixels[(this.x * DPI + this.y * DPIS * bg.width) * 4 + 2];
    var a = bg.pixels[(this.x * DPI + this.y * DPIS * bg.width) * 4 + 3];
    this.target = [r, g, b, a];
    ease(this.target, this.values, this.ease);
    noStroke();
    fill(255, 255, 255, 255);
    rect(this.x, this.y, this.size * this.values[0] / 255, this.size * this.values[2] / 255);
    // var steps = r;
    // var q = map(steps, 0, 255, -2, 2);
    // var q2 = q + 0.8;
    // q = clamp(q);
    // q2 = clamp(q2);
    // stroke(255);
    // line(this.x + q * this.size, this.y, this.x + q2 * this.size, this.y);
  }
}

var _prev_t = 0;
var _t = 0;

function update() {
  var alive = [];
  _prev_t = _t;
  _t = millis();
  var dt = _t - _prev_t;
  for (var i = 0; i < stuff.length; i++) {
    stuff[i].update(_t, dt);
    if (!stuff[i].dead) {
      alive.push(stuff[i]);
    }
  }
  stuff = alive;
}

function setup() {
  createCanvas(1000, 700);
  bg = createGraphics(width, height);

  // var skip = 20;
  // for (var x = 0; x < width; x += skip) {
  //   for (var y = 0; y < height; y += skip) {
  //     var m = new walkingColors(x, y, skip);
  //     stuff.push(m);
  //   }
  // }
  // console.log(stuff.length);
  var skip = 10;
  for (var y = 0; y < height; y += skip) {
    var m = new seperatorsRGB(0, width - 1, y, skip, 0);
    stuff.push(m);
  }
  console.log(stuff.length);
}

function draw() {
  background(0);


  bg_ellipse();
  bg.loadPixels();

  // image(bg, 0, 0);
  update();
}