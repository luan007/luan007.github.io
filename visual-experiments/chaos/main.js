function setup() {
  createCanvas(500, 500);
}

sz = 500;
function iterate(x, y, i) {
  x = i * x * (1 - x);
  y = (x + y * y + millis() / 10000.0) % 1.0;
  fill(255, 10);
  noStroke();
  rect(x * sz - 1, y * sz - 1, 2, 2);
  return [x, y, i];
}


var first = true;

var mx = 0.5;
var my = 0.5;
var params = [0.1, mx, my];
function draw() {
  var nx = mouseX / 10;
  var ny = mouseY / 100;
  background(0);
  if(nx != mx || ny != my) {
      my = ny;
      mx = nx;
      params = [0.1, mouseX / 10, mouseY / 100];
  }
  for (var i = 0; i < 15000; i++) {
    params = iterate(params[0], params[1], params[2]);
  }
}

//Chaos: When the present determines the future, but the approximate present does not approximately determine the future.
