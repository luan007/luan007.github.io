function setup() {
    createCanvas(700, 700);
  }
  var t = 0;
  function draw() {
    t += 0.001;
    blendMode(BLEND);
    fill(0, 20);
    noStroke();
    rect(0, 0, width, height);
    blendMode(ADD);
    var block_sz = 9;
    for(var x = 0; x < width; x+= block_sz) {
      for(var y = 0; y < height; y += block_sz) {
        noStroke();
        var STRIBE_H = noise(x / 50, t, y / 500);
        var STRIBE_L = noise(100 - y / 50, -t, x / 500);
        var LOWFREQ = noise(x / 500, y / 500, t);
        var HIGHFREQ = noise(x / 100, y / 100, t);
        var SINCOS = sin(x / 100 + t) * cos(y / 100 - t);
        var staged = 150 * (((HIGHFREQ * 0.1 + LOWFREQ) * 10) % 1);
        fill(staged * 0.06, staged * 0.05, staged * 0.1);
        rect(x, y, block_sz - 3, block_sz - 3);
        if(((LOWFREQ * 10) % 1) < 0.1) {
          fill(255 * 0.1, 50 * 0.1, 80 * 0.1);
          rect(x, y, block_sz - 3, block_sz - 3);
        }
        if(((HIGHFREQ * 2) % 1) < 0.01) {
          fill(0, 0, 0);
          rect(x, y, block_sz - 3, block_sz - 3);
          fill(30 * 0.1, 20 * 0.1, 50 * 0.1);
          rect(x + block_sz, y, block_sz - 3, block_sz - 3);
        }
        if(((STRIBE_H * LOWFREQ) * 5 % 1) > 0.99) {
          fill(90 * 0.1, 120 * 0.1, 50 * 0.1);
          rect(x - block_sz, y, block_sz - 3, block_sz - 3);
        }
        if(((STRIBE_L * LOWFREQ) * 5 % 1) > 0.99) {
          fill(50 * 0.1, 50 * 0.1, 120 * 0.5);
          rect(x - block_sz, y, block_sz - 3, block_sz - 3);
        }
      }
    }
  }