function setup() {
  createCanvas(500, 500);
}

var value = 0;
var diri = 0;
var value2 = 0;
var target = 1.0;

var values = [];
var values2 = [];
var diris = [];

function graph(values, txt) {
  if (values.length > 500) {
    values.shift();
  }
  noStroke();
  var h = 0;
  for (var i = 0; i < values.length; i++) {
    h = map(values[i], 0, 1, 400, 200)
    rect(i, h, 2, 2);
  }
  text(txt, 10, h);
  stroke(255, 100);
  line(0, h, 500, h);
}

var frames = 0;
var origin = 0;

function draw() {
  background(0);

  values.push(value);
  values2.push(value2);
  diris.push(diri);
  var nt = mouseY / 500;
  frames = nt != target ? 0 : (frames+1);
  origin = nt != target ? value : origin;
  target = nt;
  

  value2 += (target - value2) * 0.01;
  diri += (value2 - diri) * 0.02;
  value = Math.pow(1 - 0.01, frames) * origin - target * Math.pow(1 - 0.01, frames) + target;
  fill(255,100,100);
  graph(values, "fn(x)=x(1-e)^n+te((1-n)^n-1)/(1-e)-1");
  fill(255,255,100);
  graph(values2, "Ease");
  fill(255,255,255);
  graph(diris, "Chase");
}