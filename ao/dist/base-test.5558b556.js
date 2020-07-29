// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function(modules, cache, entry, mainEntry, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject.parcelRequire === 'function' &&
    globalObject.parcelRequire;
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x) {
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function(id, exports) {
    modules[id] = [
      function(require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  globalObject.parcelRequire = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function() {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"3Ai6t":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ticker = require("./ticker");

Object.keys(_ticker).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _ticker[key];
    }
  });
});

var _math = require("./math");

Object.keys(_math).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _math[key];
    }
  });
});

var _scene = require("./scene");

Object.keys(_scene).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _scene[key];
    }
  });
});

var _flow = require("./flow");

Object.keys(_flow).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _flow[key];
    }
  });
});

var _store = require("./store");

Object.keys(_store).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _store[key];
    }
  });
});

var _net = require("./net");

Object.keys(_net).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _net[key];
    }
  });
});
},{"./ticker":"6urOt","./math":"6FLM9","./scene":"4bsIB","./flow":"5xQWU","./store":"6aAaW","./net":"hYsxq"}],"6urOt":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ease_complex_curve = ease_complex_curve;
exports.springRaw = springRaw;
exports.springProp = springProp;
exports.spring = spring;
exports.ease = ease;
exports.easeObj = easeObj;
exports.easeArray = easeArray;
exports.eased = eased;
exports.looperSetDeltaTMultiplier = looperSetDeltaTMultiplier;
exports.tick = tick;
exports.loop = loop;
exports.noLoop = noLoop;
exports.looperStart = looperStart;
exports.looperInterval = looperInterval;
exports.changed = changed;
exports.prevT = exports.t = exports.deltaTMultipler = exports.EasedValue = exports.SpringValue = void 0;
var global = arguments[3];
//tiny updatez
const PRECISION = 0.0001;
var deltaT = 0;
var LIMIT_T = true; //set this to false will ensure Date.now() gets used
//0-1 range easing

function ease_complex_curve(f, t, sp, precision) {//TBD - map abs(f-t) with sin & cos
}

function springRaw(cur, target, velocity, stiffness, damping, mass = 1) {
  //http://en.wikipedia.org/wiki/Hooke%27s_law | F = -kx
  //F = -kx - bv
  var d = -target + cur;
  var f = -1 * (stiffness * d);
  f -= damping * velocity;
  var acc = f / mass;
  velocity += acc * deltaT;
  cur += velocity * deltaT; //move

  if (Math.abs(cur - target) < precision) {
    return [target, velocity]; //keep track of v & p
  }

  return [cur, velocity];
}

function springProp(prop, precision = PRECISION) {
  //http://en.wikipedia.org/wiki/Hooke%27s_law | F = -kx
  //F = -kx - bv
  var {
    value = 0,
    to = 0,
    velocity = 0,
    stiffness = 0.001,
    damping = 0.9,
    mass = 0.1,
    stopped = false,
    completed = false
  } = prop;
  var d = -to + value;
  var f = -1 * (stiffness * d);
  f -= damping * velocity;
  var acc = f / mass;
  velocity += acc * deltaT;
  value += velocity * deltaT; //move

  stopped = false;
  completed = false;

  if (Math.abs(value - to) < precision) {
    value = to;
    stopped = true;
    completed = true;
  } else if (Math.abs(velocity) < precision * 0.1) {
    stopped = true;
  }

  prop.value = value;
  prop.to = to;
  prop.velocity = velocity;
  prop.stiffness = stiffness;
  prop.damping = damping;
  prop.mass = mass;
  prop.stopped = stopped;
  prop.completed = completed;
  return prop;
}

var _spring_values = [];

class SpringValue {
  constructor({
    value = 0,
    to = 0,
    velocity = 0,
    stiffness = 0.1,
    damping = 0.9,
    mass = 1,
    stopped = false,
    completed = false,
    precision = PRECISION
  }) {
    this.value = value;
    this.to = to;
    this.precision = precision || PRECISION;
    this.velocity = velocity;
    this.stiffness = stiffness;
    this.mass = mass;
    this.stopped = stopped;
    this.completed = completed;
    this.damping = damping;

    _spring_values.push(this);

    this.updating = true;
  }

  valueOf() {
    return this.value;
  }

  tick() {
    springProp(this, this.precision);
  }

  toString() {
    return this.value.toString();
  }

  set(v) {
    this.value = v;
  }

  target(v) {
    this.to = v;
  }

}

exports.SpringValue = SpringValue;

function spring({
  value = 0,
  to = 0,
  velocity = 0,
  stiffness = 0.00001,
  damping = 0.5,
  mass = 1,
  stopped = false,
  completed = false,
  precision = PRECISION
}) {
  return new SpringValue(arguments[0] || {});
}

function _update_springs() {
  for (var i = 0; i < _spring_values.length; i++) {
    _spring_values[i].tick();
  }
}

function ease(f, t, sp, precision) {
  precision = precision || PRECISION;

  if (Math.abs(f - t) < precision) {
    return t;
  }

  return f + (t - f) * sp * deltaT;
}

function easeObj(f) {
  f.value = ease(f.value, f.to, f.e, f.precision);
}

function easeArray(f, t, sp, precision) {
  for (var i = 0; i < f.length; i++) {
    f[i] = ease(f[i], Array.isArray(t) ? t[i] : t, Array.isArray(sp) ? sp[i] : sp, Array.isArray(precision) ? precision[i] : precision);
  }
}

var _eased_values = [];

function eased(v, t, e, prec) {
  return new EasedValue(v, t, e, prec);
}

class EasedValue {
  constructor(value, to, e, precision) {
    this.value = value;
    this.to = to;
    this.precision = precision || PRECISION;
    this.e = e;
    this.velocity = 0;

    _eased_values.push(this);

    this.updating = true;
  }

  valueOf() {
    return this.value;
  }

  tick() {
    var prev = this.value;
    this.value = ease(this.value, this.to, this.e, this.precision);
    this.velocity = this.value - prev;
  }

  toString() {
    return this.value.toString();
  }

  set(v) {
    this.value = v;
  }

  target(v) {
    this.to = v;
  }

}

exports.EasedValue = EasedValue;

function _update_eased() {
  for (var i = 0; i < _eased_values.length; i++) {
    _eased_values[i].tick();
  }
}

var deltaTMultipler = 60;
exports.deltaTMultipler = deltaTMultipler;

function looperSetDeltaTMultiplier(s) {
  exports.deltaTMultipler = deltaTMultipler = s;
}

var all = [];
var removal = [];
var t = Date.now() / 1000 % 1000000;
exports.t = t;
var prevT = Date.now() / 1000 % 1000000;
exports.prevT = prevT;

function tick() {
  deltaT = (t - prevT) * deltaTMultipler;
  exports.prevT = prevT = t;

  if (deltaT < 0) {
    deltaT = 1;
  }

  if (deltaT > 3) {
    deltaT = 1;
  }

  if (LIMIT_T) {
    exports.t = t = Date.now() % 100000000 * 0.001;
  } else {
    exports.t = t = Date.now() * 0.001;
  }

  if (removal.length > 0) {
    var _new = [];

    for (var i = 0; i < all.length; i++) {
      if (removal.indexOf(all[i]) >= 0) {
        continue;
      }

      _new.push(all[i]);
    }

    removal = [];
    all = _new;
  }

  for (var i = 0; i < all.length; i++) {
    all[i](t, deltaT);
  }
}

function loop(func_or_obj) {
  var func = func_or_obj.update || func_or_obj;

  if (all.indexOf(func) >= 0) {
    return;
  }

  all.push(func);
}

function noLoop(func_or_obj) {
  var func = func_or_obj.update || func_or_obj;

  if (removal.indexOf(func) >= 0) {
    return;
  }

  removal.push(func);
}

function looperStart(grab_raf, lim_t) {
  var raf = global.requestAnimationFrame;

  if (grab_raf) {
    global.requestAnimationFrame = () => {
      console.warn("Some Library is causing trouble. RAF HAS BEEN GRABBED BY LOOPER_START from AO for code const perf");
    };
  }

  LIMIT_T = lim_t;

  var _updator_thread = function () {
    raf(_updator_thread);
    tick();
  };

  _updator_thread();
}

var _keys = {};

function looperInterval(key, span) {
  _keys[key] = _keys[key] || Date.now();

  if (Date.now() > _keys[key] + span) {
    _keys[key] = Date.now();
    return true;
  }

  return false;
}

var _value_lib = {};
var _value_keys = {};

function changed(key, cur) {
  var changed = _value_lib[key] != cur;
  _value_lib[key] = cur;
  _value_keys[key] = 1;
  return changed;
}

loop(_update_eased);
loop(_update_springs);
},{}],"6FLM9":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.map = map;
exports.avg = avg;
exports.clamp = clamp;
exports.crand = crand;
exports.normD = normD;
exports.rrand = rrand;
exports.normalize = normalize;
exports.clampWrap = clampWrap;
exports.within = within;
exports.indexify = indexify;
exports.segmentize = segmentize;
exports.lerp = lerp;
exports.shuffleArray = shuffleArray;
exports.mapped = mapped;
exports.pick = pick;
exports.place = place;
exports.simplexArray2d = simplexArray2d;
exports.simplexArray3d = simplexArray3d;
exports.simplexArray4d = simplexArray4d;
exports.pickClosest2d = pickClosest2d;
exports.ImprovedNoise = exports.openSimplex = exports.MappedValue = void 0;

var _openSimplexNoise = _interopRequireDefault(require("open-simplex-noise"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function map(q, a, b, c, d, clamp) {
  var perc = (q - a) / (b - a);
  perc = clamp ? Math.min(Math.max(perc, 0.0), 1.0) : perc;
  var raw = perc * (d - c) + c;
  return raw;
}

function avg(arr, offset) {
  var m = 0;
  offset = offset || 0;

  for (var i = 0; i < arr.length; i++) {
    m += (arr[i] + offset) / arr.length;
  }

  return m;
}

function clamp(v, a, b) {
  return v < a ? a : v > b ? b : v;
}

function crand(range, off) {
  range = range || 0.5;
  off = off || 0;
  return off + (Math.random() - 0.5) * 2 * range;
}

function normD(x) {
  return Math.pow(Math.E, -x * x * 2 * Math.PI);
}

function rrand(from, to) {
  from = from || -0.5;
  to = to || 0.5;
  return map(Math.random(), 0, 1, from, to);
} //turns anything into sth between 0~1 - also wrapped


function normalize(q, a, b, wrap) {
  wrap = wrap || true;
  var mapped = map(q, a, b, 0, 1);

  if (wrap) {
    mapped = mapped % 1;
    mapped = mapped < 0 ? mapped + 1 : mapped;
  }

  return mapped;
}

function clampWrap(q, a, b) {
  //-2.4 0~1
  var range = b - a;
  if (range == 0) return 0;
  var relative = q % range;
  return (relative < 0 ? range + relative : relative) + a;
} //flip flop, determines something is within range


function within(q, a, b) {
  return q <= b && q >= a ? 1.0 : 0.0;
} //turns one number into 'array alike' switches // e.g  0, 10, 0.3 //current 0.3 -> 0/10, false


function indexify(index, length, value_normalized, signed) {
  //e.g 0~1  -> chops into 0~0.1, 0.1~0.2, 0.2~0.3, 0.3~0.4...
  var segment = 1 / length;
  var target = index / length + segment / 2;
  var sign = signed ? Math.sign(value_normalized - target) : 1;
  return sign * map(Math.abs(value_normalized - target), segment / 2, 0, 0, 1, true);
} //turns something


function segmentize(index, length, val) {
  //e.g 0~1  -> chops into 0~0.1, 0.1~0.2, 0.2~0.3, 0.3~0.4...
  var segment = 1 / length;
  var begin = index / length;
  var end = begin + segment;
  return map(val, begin, end, 0, 1, true);
}

function lerp(q, a, b, clamp) {
  return map(q, 0, 1, a, b, clamp);
}

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  return array;
}

class MappedValue {
  constructor(v, a, b, c, d, clamp) {
    this.value = v;
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.clamp = clamp || false;
    this._calculated = false;
    this.update();
  }

  set(v) {
    this.value = v;
  }

  range(a, b, c, d) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
  }

  update() {
    this.mapped = map(this.value, this.a, this.b, this.c, this.d);
    this._calculated = true;
  }

  valueOf() {
    if (this._calculated) this.update();
    return this.mapped;
  }

  toString() {
    return this.value.toString();
  }

}

exports.MappedValue = MappedValue;

function mapped(q, a, b, c, d, clamp) {
  var v = new MappedValue(q, a, b, c, d, clamp);
  return v;
}

function pick(arr, val) {
  var _arr = arr;

  if (!Array.isArray(arr)) {
    _arr = Object.keys(arr);
  }

  val = val == undefined ? Math.random() : val;

  var key = _arr[Math.floor(val * _arr.length)];

  return _arr == arr ? key : arr[key];
}

function place(item, arr, max_length) {
  max_length = max_length || -1;

  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == null) {
      arr[i] = item;
      return i;
    }
  }

  if (arr.length > max_length) {
    return -1;
  }

  arr.push(item);
  return arr.length - 1;
}

var openSimplex = new _openSimplexNoise.default();
exports.openSimplex = openSimplex;

function simplexArray2d(width, height, scale) {
  var output = new Array(width);

  for (var x = 0; x < width; x++) {
    output[x] = new Array(height);

    for (var y = 0; y < height; y++) {
      output[x][y] = openSimplex.noise2D(x * scale, y * scale);
    }
  }

  return output;
}

function simplexArray3d(width, height, depth, scale) {
  var output = new Array(width);

  for (var x = 0; x < width; x++) {
    output[x] = new Array(height);

    for (var y = 0; y < height; y++) {
      output[x][y] = new Array(depth);

      for (var z = 0; z < depth; z++) {
        output[x][y][z] = _openSimplexNoise.default.noise3D(x * scale, y * scale, z * scale);
      }
    }
  }

  return output;
}

;

function simplexArray4d(width, height, depth, wLength, scale) {
  var output = new Array(width);

  for (var x = 0; x < width; x++) {
    output[x] = new Array(height);

    for (var y = 0; y < height; y++) {
      output[x][y] = new Array(depth);

      for (var z = 0; z < depth; z++) {
        output[x][y][z] = new Array(wLength);

        for (var w = 0; w < wLength; w++) {
          output[x][y][z][w] = openSimplex.noise4D(x * scale, y * scale, z * scale, w * scale);
        }
      }
    }
  }

  return output;
}

; // console.log(simplexArray2d(1000, 1000, 0.01));

function pickClosest2d(x, y, arr2d) {
  x = Math.floor(x) % arr2d.length;
  x = x < 0 ? x + arr2d.length : x;
  y = Math.floor(y) % arr2d[x].length;
  y = y < 0 ? y + arr2d[x].length : y;
  return arr2d[x][y];
}

var ImprovedNoise = function () {
  var p = [151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180];

  for (var i = 0; i < 256; i++) {
    p[256 + i] = p[i];
  }

  function fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  function lerp(t, a, b) {
    return a + t * (b - a);
  }

  function grad(hash, x, y, z) {
    var h = hash & 15;
    var u = h < 8 ? x : y,
        v = h < 4 ? y : h == 12 || h == 14 ? x : z;
    return ((h & 1) == 0 ? u : -u) + ((h & 2) == 0 ? v : -v);
  }

  return {
    noise: function (x, y, z) {
      var floorX = Math.floor(x),
          floorY = Math.floor(y),
          floorZ = Math.floor(z);
      var X = floorX & 255,
          Y = floorY & 255,
          Z = floorZ & 255;
      x -= floorX;
      y -= floorY;
      z -= floorZ;
      var xMinus1 = x - 1,
          yMinus1 = y - 1,
          zMinus1 = z - 1;
      var u = fade(x),
          v = fade(y),
          w = fade(z);
      var A = p[X] + Y,
          AA = p[A] + Z,
          AB = p[A + 1] + Z,
          B = p[X + 1] + Y,
          BA = p[B] + Z,
          BB = p[B + 1] + Z;
      return lerp(w, lerp(v, lerp(u, grad(p[AA], x, y, z), grad(p[BA], xMinus1, y, z)), lerp(u, grad(p[AB], x, yMinus1, z), grad(p[BB], xMinus1, yMinus1, z))), lerp(v, lerp(u, grad(p[AA + 1], x, y, zMinus1), grad(p[BA + 1], xMinus1, y, z - 1)), lerp(u, grad(p[AB + 1], x, yMinus1, zMinus1), grad(p[BB + 1], xMinus1, yMinus1, zMinus1))));
    }
  };
};

exports.ImprovedNoise = ImprovedNoise;
},{"open-simplex-noise":"13QkU"}],"13QkU":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var constants_1 = require("./constants");

var Contribution2 =
/** @class */
function () {
  function Contribution2(multiplier, xsb, ysb) {
    this.dx = -xsb - multiplier * constants_1.SQUISH_2D;
    this.dy = -ysb - multiplier * constants_1.SQUISH_2D;
    this.xsb = xsb;
    this.ysb = ysb;
  }

  return Contribution2;
}();

var Contribution3 =
/** @class */
function () {
  function Contribution3(multiplier, xsb, ysb, zsb) {
    this.dx = -xsb - multiplier * constants_1.SQUISH_3D;
    this.dy = -ysb - multiplier * constants_1.SQUISH_3D;
    this.dz = -zsb - multiplier * constants_1.SQUISH_3D;
    this.xsb = xsb;
    this.ysb = ysb;
    this.zsb = zsb;
  }

  return Contribution3;
}();

var Contribution4 =
/** @class */
function () {
  function Contribution4(multiplier, xsb, ysb, zsb, wsb) {
    this.dx = -xsb - multiplier * constants_1.SQUISH_4D;
    this.dy = -ysb - multiplier * constants_1.SQUISH_4D;
    this.dz = -zsb - multiplier * constants_1.SQUISH_4D;
    this.dw = -wsb - multiplier * constants_1.SQUISH_4D;
    this.xsb = xsb;
    this.ysb = ysb;
    this.zsb = zsb;
    this.wsb = wsb;
  }

  return Contribution4;
}();

function shuffleSeed(seed) {
  var newSeed = new Uint32Array(1);
  newSeed[0] = seed[0] * 1664525 + 1013904223;
  return newSeed;
}

var OpenSimplexNoise =
/** @class */
function () {
  function OpenSimplexNoise(clientSeed) {
    this.initialize();
    this.perm = new Uint8Array(256);
    this.perm2D = new Uint8Array(256);
    this.perm3D = new Uint8Array(256);
    this.perm4D = new Uint8Array(256);
    var source = new Uint8Array(256);

    for (var i = 0; i < 256; i++) source[i] = i;

    var seed = new Uint32Array(1);
    seed[0] = clientSeed;
    seed = shuffleSeed(shuffleSeed(shuffleSeed(seed)));

    for (var i = 255; i >= 0; i--) {
      seed = shuffleSeed(seed);
      var r = new Uint32Array(1);
      r[0] = (seed[0] + 31) % (i + 1);
      if (r[0] < 0) r[0] += i + 1;
      this.perm[i] = source[r[0]];
      this.perm2D[i] = this.perm[i] & 0x0e;
      this.perm3D[i] = this.perm[i] % 24 * 3;
      this.perm4D[i] = this.perm[i] & 0xfc;
      source[r[0]] = source[i];
    }
  }

  OpenSimplexNoise.prototype.array2D = function (width, height) {
    var output = new Array(width);

    for (var x = 0; x < width; x++) {
      output[x] = new Array(height);

      for (var y = 0; y < height; y++) {
        output[x][y] = this.noise2D(x, y);
      }
    }

    return output;
  };

  OpenSimplexNoise.prototype.array3D = function (width, height, depth) {
    var output = new Array(width);

    for (var x = 0; x < width; x++) {
      output[x] = new Array(height);

      for (var y = 0; y < height; y++) {
        output[x][y] = new Array(depth);

        for (var z = 0; z < depth; z++) {
          output[x][y][z] = this.noise3D(x, y, z);
        }
      }
    }

    return output;
  };

  OpenSimplexNoise.prototype.array4D = function (width, height, depth, wLength) {
    var output = new Array(width);

    for (var x = 0; x < width; x++) {
      output[x] = new Array(height);

      for (var y = 0; y < height; y++) {
        output[x][y] = new Array(depth);

        for (var z = 0; z < depth; z++) {
          output[x][y][z] = new Array(wLength);

          for (var w = 0; w < wLength; w++) {
            output[x][y][z][w] = this.noise4D(x, y, z, w);
          }
        }
      }
    }

    return output;
  };

  OpenSimplexNoise.prototype.noise2D = function (x, y) {
    var stretchOffset = (x + y) * constants_1.STRETCH_2D;
    var xs = x + stretchOffset;
    var ys = y + stretchOffset;
    var xsb = Math.floor(xs);
    var ysb = Math.floor(ys);
    var squishOffset = (xsb + ysb) * constants_1.SQUISH_2D;
    var dx0 = x - (xsb + squishOffset);
    var dy0 = y - (ysb + squishOffset);
    var xins = xs - xsb;
    var yins = ys - ysb;
    var inSum = xins + yins;
    var hash = xins - yins + 1 | inSum << 1 | inSum + yins << 2 | inSum + xins << 4;
    var value = 0;

    for (var c = this.lookup2D[hash]; c !== undefined; c = c.next) {
      var dx = dx0 + c.dx;
      var dy = dy0 + c.dy;
      var attn = 2 - dx * dx - dy * dy;

      if (attn > 0) {
        var px = xsb + c.xsb;
        var py = ysb + c.ysb;
        var indexPartA = this.perm[px & 0xff];
        var index = this.perm2D[indexPartA + py & 0xff];
        var valuePart = constants_1.gradients2D[index] * dx + constants_1.gradients2D[index + 1] * dy;
        value += attn * attn * attn * attn * valuePart;
      }
    }

    return value * constants_1.NORM_2D;
  };

  OpenSimplexNoise.prototype.noise3D = function (x, y, z) {
    var stretchOffset = (x + y + z) * constants_1.STRETCH_3D;
    var xs = x + stretchOffset;
    var ys = y + stretchOffset;
    var zs = z + stretchOffset;
    var xsb = Math.floor(xs);
    var ysb = Math.floor(ys);
    var zsb = Math.floor(zs);
    var squishOffset = (xsb + ysb + zsb) * constants_1.SQUISH_3D;
    var dx0 = x - (xsb + squishOffset);
    var dy0 = y - (ysb + squishOffset);
    var dz0 = z - (zsb + squishOffset);
    var xins = xs - xsb;
    var yins = ys - ysb;
    var zins = zs - zsb;
    var inSum = xins + yins + zins;
    var hash = yins - zins + 1 | xins - yins + 1 << 1 | xins - zins + 1 << 2 | inSum << 3 | inSum + zins << 5 | inSum + yins << 7 | inSum + xins << 9;
    var value = 0;

    for (var c = this.lookup3D[hash]; c !== undefined; c = c.next) {
      var dx = dx0 + c.dx;
      var dy = dy0 + c.dy;
      var dz = dz0 + c.dz;
      var attn = 2 - dx * dx - dy * dy - dz * dz;

      if (attn > 0) {
        var px = xsb + c.xsb;
        var py = ysb + c.ysb;
        var pz = zsb + c.zsb;
        var indexPartA = this.perm[px & 0xff];
        var indexPartB = this.perm[indexPartA + py & 0xff];
        var index = this.perm3D[indexPartB + pz & 0xff];
        var valuePart = constants_1.gradients3D[index] * dx + constants_1.gradients3D[index + 1] * dy + constants_1.gradients3D[index + 2] * dz;
        value += attn * attn * attn * attn * valuePart;
      }
    }

    return value * constants_1.NORM_3D;
  };

  OpenSimplexNoise.prototype.noise4D = function (x, y, z, w) {
    var stretchOffset = (x + y + z + w) * constants_1.STRETCH_4D;
    var xs = x + stretchOffset;
    var ys = y + stretchOffset;
    var zs = z + stretchOffset;
    var ws = w + stretchOffset;
    var xsb = Math.floor(xs);
    var ysb = Math.floor(ys);
    var zsb = Math.floor(zs);
    var wsb = Math.floor(ws);
    var squishOffset = (xsb + ysb + zsb + wsb) * constants_1.SQUISH_4D;
    var dx0 = x - (xsb + squishOffset);
    var dy0 = y - (ysb + squishOffset);
    var dz0 = z - (zsb + squishOffset);
    var dw0 = w - (wsb + squishOffset);
    var xins = xs - xsb;
    var yins = ys - ysb;
    var zins = zs - zsb;
    var wins = ws - wsb;
    var inSum = xins + yins + zins + wins;
    var hash = zins - wins + 1 | yins - zins + 1 << 1 | yins - wins + 1 << 2 | xins - yins + 1 << 3 | xins - zins + 1 << 4 | xins - wins + 1 << 5 | inSum << 6 | inSum + wins << 8 | inSum + zins << 11 | inSum + yins << 14 | inSum + xins << 17;
    var value = 0;

    for (var c = this.lookup4D[hash]; c !== undefined; c = c.next) {
      var dx = dx0 + c.dx;
      var dy = dy0 + c.dy;
      var dz = dz0 + c.dz;
      var dw = dw0 + c.dw;
      var attn = 2 - dx * dx - dy * dy - dz * dz - dw * dw;

      if (attn > 0) {
        var px = xsb + c.xsb;
        var py = ysb + c.ysb;
        var pz = zsb + c.zsb;
        var pw = wsb + c.wsb;
        var indexPartA = this.perm[px & 0xff];
        var indexPartB = this.perm[indexPartA + py & 0xff];
        var indexPartC = this.perm[indexPartB + pz & 0xff];
        var index = this.perm4D[indexPartC + pw & 0xff];
        var valuePart = constants_1.gradients4D[index] * dx + constants_1.gradients4D[index + 1] * dy + constants_1.gradients4D[index + 2] * dz + constants_1.gradients4D[index + 3] * dw;
        value += attn * attn * attn * attn * valuePart;
      }
    }

    return value * constants_1.NORM_4D;
  };

  OpenSimplexNoise.prototype.initialize = function () {
    var contributions2D = [];

    for (var i = 0; i < constants_1.p2D.length; i += 4) {
      var baseSet = constants_1.base2D[constants_1.p2D[i]];
      var previous = null;
      var current = null;

      for (var k = 0; k < baseSet.length; k += 3) {
        current = new Contribution2(baseSet[k], baseSet[k + 1], baseSet[k + 2]);
        if (previous === null) contributions2D[i / 4] = current;else previous.next = current;
        previous = current;
      }

      current.next = new Contribution2(constants_1.p2D[i + 1], constants_1.p2D[i + 2], constants_1.p2D[i + 3]);
    }

    this.lookup2D = [];

    for (var i = 0; i < constants_1.lookupPairs2D.length; i += 2) {
      this.lookup2D[constants_1.lookupPairs2D[i]] = contributions2D[constants_1.lookupPairs2D[i + 1]];
    }

    var contributions3D = [];

    for (var i = 0; i < constants_1.p3D.length; i += 9) {
      var baseSet = constants_1.base3D[constants_1.p3D[i]];
      var previous = null;
      var current = null;

      for (var k = 0; k < baseSet.length; k += 4) {
        current = new Contribution3(baseSet[k], baseSet[k + 1], baseSet[k + 2], baseSet[k + 3]);
        if (previous === null) contributions3D[i / 9] = current;else previous.next = current;
        previous = current;
      }

      current.next = new Contribution3(constants_1.p3D[i + 1], constants_1.p3D[i + 2], constants_1.p3D[i + 3], constants_1.p3D[i + 4]);
      current.next.next = new Contribution3(constants_1.p3D[i + 5], constants_1.p3D[i + 6], constants_1.p3D[i + 7], constants_1.p3D[i + 8]);
    }

    this.lookup3D = [];

    for (var i = 0; i < constants_1.lookupPairs3D.length; i += 2) {
      this.lookup3D[constants_1.lookupPairs3D[i]] = contributions3D[constants_1.lookupPairs3D[i + 1]];
    }

    var contributions4D = [];

    for (var i = 0; i < constants_1.p4D.length; i += 16) {
      var baseSet = constants_1.base4D[constants_1.p4D[i]];
      var previous = null;
      var current = null;

      for (var k = 0; k < baseSet.length; k += 5) {
        current = new Contribution4(baseSet[k], baseSet[k + 1], baseSet[k + 2], baseSet[k + 3], baseSet[k + 4]);
        if (previous === null) contributions4D[i / 16] = current;else previous.next = current;
        previous = current;
      }

      current.next = new Contribution4(constants_1.p4D[i + 1], constants_1.p4D[i + 2], constants_1.p4D[i + 3], constants_1.p4D[i + 4], constants_1.p4D[i + 5]);
      current.next.next = new Contribution4(constants_1.p4D[i + 6], constants_1.p4D[i + 7], constants_1.p4D[i + 8], constants_1.p4D[i + 9], constants_1.p4D[i + 10]);
      current.next.next.next = new Contribution4(constants_1.p4D[i + 11], constants_1.p4D[i + 12], constants_1.p4D[i + 13], constants_1.p4D[i + 14], constants_1.p4D[i + 15]);
    }

    this.lookup4D = [];

    for (var i = 0; i < constants_1.lookupPairs4D.length; i += 2) {
      this.lookup4D[constants_1.lookupPairs4D[i]] = contributions4D[constants_1.lookupPairs4D[i + 1]];
    }
  };

  return OpenSimplexNoise;
}();

exports.default = OpenSimplexNoise;
},{"./constants":"69VcO"}],"69VcO":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NORM_2D = 1.0 / 47.0;
exports.NORM_3D = 1.0 / 103.0;
exports.NORM_4D = 1.0 / 30.0;
exports.SQUISH_2D = (Math.sqrt(2 + 1) - 1) / 2;
exports.SQUISH_3D = (Math.sqrt(3 + 1) - 1) / 3;
exports.SQUISH_4D = (Math.sqrt(4 + 1) - 1) / 4;
exports.STRETCH_2D = (1 / Math.sqrt(2 + 1) - 1) / 2;
exports.STRETCH_3D = (1 / Math.sqrt(3 + 1) - 1) / 3;
exports.STRETCH_4D = (1 / Math.sqrt(4 + 1) - 1) / 4;
exports.base2D = [[1, 1, 0, 1, 0, 1, 0, 0, 0], [1, 1, 0, 1, 0, 1, 2, 1, 1]];
exports.base3D = [[0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1], [2, 1, 1, 0, 2, 1, 0, 1, 2, 0, 1, 1, 3, 1, 1, 1], [1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 2, 1, 1, 0, 2, 1, 0, 1, 2, 0, 1, 1]];
exports.base4D = [[0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1], [3, 1, 1, 1, 0, 3, 1, 1, 0, 1, 3, 1, 0, 1, 1, 3, 0, 1, 1, 1, 4, 1, 1, 1, 1], [1, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 2, 1, 1, 0, 0, 2, 1, 0, 1, 0, 2, 1, 0, 0, 1, 2, 0, 1, 1, 0, 2, 0, 1, 0, 1, 2, 0, 0, 1, 1], [3, 1, 1, 1, 0, 3, 1, 1, 0, 1, 3, 1, 0, 1, 1, 3, 0, 1, 1, 1, 2, 1, 1, 0, 0, 2, 1, 0, 1, 0, 2, 1, 0, 0, 1, 2, 0, 1, 1, 0, 2, 0, 1, 0, 1, 2, 0, 0, 1, 1]];
exports.gradients2D = [5, 2, 2, 5, -5, 2, -2, 5, 5, -2, 2, -5, -5, -2, -2, -5];
exports.gradients3D = [-11, 4, 4, -4, 11, 4, -4, 4, 11, 11, 4, 4, 4, 11, 4, 4, 4, 11, -11, -4, 4, -4, -11, 4, -4, -4, 11, 11, -4, 4, 4, -11, 4, 4, -4, 11, -11, 4, -4, -4, 11, -4, -4, 4, -11, 11, 4, -4, 4, 11, -4, 4, 4, -11, -11, -4, -4, -4, -11, -4, -4, -4, -11, 11, -4, -4, 4, -11, -4, 4, -4, -11];
exports.gradients4D = [3, 1, 1, 1, 1, 3, 1, 1, 1, 1, 3, 1, 1, 1, 1, 3, -3, 1, 1, 1, -1, 3, 1, 1, -1, 1, 3, 1, -1, 1, 1, 3, 3, -1, 1, 1, 1, -3, 1, 1, 1, -1, 3, 1, 1, -1, 1, 3, -3, -1, 1, 1, -1, -3, 1, 1, -1, -1, 3, 1, -1, -1, 1, 3, 3, 1, -1, 1, 1, 3, -1, 1, 1, 1, -3, 1, 1, 1, -1, 3, -3, 1, -1, 1, -1, 3, -1, 1, -1, 1, -3, 1, -1, 1, -1, 3, 3, -1, -1, 1, 1, -3, -1, 1, 1, -1, -3, 1, 1, -1, -1, 3, -3, -1, -1, 1, -1, -3, -1, 1, -1, -1, -3, 1, -1, -1, -1, 3, 3, 1, 1, -1, 1, 3, 1, -1, 1, 1, 3, -1, 1, 1, 1, -3, -3, 1, 1, -1, -1, 3, 1, -1, -1, 1, 3, -1, -1, 1, 1, -3, 3, -1, 1, -1, 1, -3, 1, -1, 1, -1, 3, -1, 1, -1, 1, -3, -3, -1, 1, -1, -1, -3, 1, -1, -1, -1, 3, -1, -1, -1, 1, -3, 3, 1, -1, -1, 1, 3, -1, -1, 1, 1, -3, -1, 1, 1, -1, -3, -3, 1, -1, -1, -1, 3, -1, -1, -1, 1, -3, -1, -1, 1, -1, -3, 3, -1, -1, -1, 1, -3, -1, -1, 1, -1, -3, -1, 1, -1, -1, -3, -3, -1, -1, -1, -1, -3, -1, -1, -1, -1, -3, -1, -1, -1, -1, -3];
exports.lookupPairs2D = [0, 1, 1, 0, 4, 1, 17, 0, 20, 2, 21, 2, 22, 5, 23, 5, 26, 4, 39, 3, 42, 4, 43, 3];
exports.lookupPairs3D = [0, 2, 1, 1, 2, 2, 5, 1, 6, 0, 7, 0, 32, 2, 34, 2, 129, 1, 133, 1, 160, 5, 161, 5, 518, 0, 519, 0, 546, 4, 550, 4, 645, 3, 647, 3, 672, 5, 673, 5, 674, 4, 677, 3, 678, 4, 679, 3, 680, 13, 681, 13, 682, 12, 685, 14, 686, 12, 687, 14, 712, 20, 714, 18, 809, 21, 813, 23, 840, 20, 841, 21, 1198, 19, 1199, 22, 1226, 18, 1230, 19, 1325, 23, 1327, 22, 1352, 15, 1353, 17, 1354, 15, 1357, 17, 1358, 16, 1359, 16, 1360, 11, 1361, 10, 1362, 11, 1365, 10, 1366, 9, 1367, 9, 1392, 11, 1394, 11, 1489, 10, 1493, 10, 1520, 8, 1521, 8, 1878, 9, 1879, 9, 1906, 7, 1910, 7, 2005, 6, 2007, 6, 2032, 8, 2033, 8, 2034, 7, 2037, 6, 2038, 7, 2039, 6];
exports.lookupPairs4D = [0, 3, 1, 2, 2, 3, 5, 2, 6, 1, 7, 1, 8, 3, 9, 2, 10, 3, 13, 2, 16, 3, 18, 3, 22, 1, 23, 1, 24, 3, 26, 3, 33, 2, 37, 2, 38, 1, 39, 1, 41, 2, 45, 2, 54, 1, 55, 1, 56, 0, 57, 0, 58, 0, 59, 0, 60, 0, 61, 0, 62, 0, 63, 0, 256, 3, 258, 3, 264, 3, 266, 3, 272, 3, 274, 3, 280, 3, 282, 3, 2049, 2, 2053, 2, 2057, 2, 2061, 2, 2081, 2, 2085, 2, 2089, 2, 2093, 2, 2304, 9, 2305, 9, 2312, 9, 2313, 9, 16390, 1, 16391, 1, 16406, 1, 16407, 1, 16422, 1, 16423, 1, 16438, 1, 16439, 1, 16642, 8, 16646, 8, 16658, 8, 16662, 8, 18437, 6, 18439, 6, 18469, 6, 18471, 6, 18688, 9, 18689, 9, 18690, 8, 18693, 6, 18694, 8, 18695, 6, 18696, 9, 18697, 9, 18706, 8, 18710, 8, 18725, 6, 18727, 6, 131128, 0, 131129, 0, 131130, 0, 131131, 0, 131132, 0, 131133, 0, 131134, 0, 131135, 0, 131352, 7, 131354, 7, 131384, 7, 131386, 7, 133161, 5, 133165, 5, 133177, 5, 133181, 5, 133376, 9, 133377, 9, 133384, 9, 133385, 9, 133400, 7, 133402, 7, 133417, 5, 133421, 5, 133432, 7, 133433, 5, 133434, 7, 133437, 5, 147510, 4, 147511, 4, 147518, 4, 147519, 4, 147714, 8, 147718, 8, 147730, 8, 147734, 8, 147736, 7, 147738, 7, 147766, 4, 147767, 4, 147768, 7, 147770, 7, 147774, 4, 147775, 4, 149509, 6, 149511, 6, 149541, 6, 149543, 6, 149545, 5, 149549, 5, 149558, 4, 149559, 4, 149561, 5, 149565, 5, 149566, 4, 149567, 4, 149760, 9, 149761, 9, 149762, 8, 149765, 6, 149766, 8, 149767, 6, 149768, 9, 149769, 9, 149778, 8, 149782, 8, 149784, 7, 149786, 7, 149797, 6, 149799, 6, 149801, 5, 149805, 5, 149814, 4, 149815, 4, 149816, 7, 149817, 5, 149818, 7, 149821, 5, 149822, 4, 149823, 4, 149824, 37, 149825, 37, 149826, 36, 149829, 34, 149830, 36, 149831, 34, 149832, 37, 149833, 37, 149842, 36, 149846, 36, 149848, 35, 149850, 35, 149861, 34, 149863, 34, 149865, 33, 149869, 33, 149878, 32, 149879, 32, 149880, 35, 149881, 33, 149882, 35, 149885, 33, 149886, 32, 149887, 32, 150080, 49, 150082, 48, 150088, 49, 150098, 48, 150104, 47, 150106, 47, 151873, 46, 151877, 45, 151881, 46, 151909, 45, 151913, 44, 151917, 44, 152128, 49, 152129, 46, 152136, 49, 152137, 46, 166214, 43, 166215, 42, 166230, 43, 166247, 42, 166262, 41, 166263, 41, 166466, 48, 166470, 43, 166482, 48, 166486, 43, 168261, 45, 168263, 42, 168293, 45, 168295, 42, 168512, 31, 168513, 28, 168514, 31, 168517, 28, 168518, 25, 168519, 25, 280952, 40, 280953, 39, 280954, 40, 280957, 39, 280958, 38, 280959, 38, 281176, 47, 281178, 47, 281208, 40, 281210, 40, 282985, 44, 282989, 44, 283001, 39, 283005, 39, 283208, 30, 283209, 27, 283224, 30, 283241, 27, 283256, 22, 283257, 22, 297334, 41, 297335, 41, 297342, 38, 297343, 38, 297554, 29, 297558, 24, 297562, 29, 297590, 24, 297594, 21, 297598, 21, 299365, 26, 299367, 23, 299373, 26, 299383, 23, 299389, 20, 299391, 20, 299584, 31, 299585, 28, 299586, 31, 299589, 28, 299590, 25, 299591, 25, 299592, 30, 299593, 27, 299602, 29, 299606, 24, 299608, 30, 299610, 29, 299621, 26, 299623, 23, 299625, 27, 299629, 26, 299638, 24, 299639, 23, 299640, 22, 299641, 22, 299642, 21, 299645, 20, 299646, 21, 299647, 20, 299648, 61, 299649, 60, 299650, 61, 299653, 60, 299654, 59, 299655, 59, 299656, 58, 299657, 57, 299666, 55, 299670, 54, 299672, 58, 299674, 55, 299685, 52, 299687, 51, 299689, 57, 299693, 52, 299702, 54, 299703, 51, 299704, 56, 299705, 56, 299706, 53, 299709, 50, 299710, 53, 299711, 50, 299904, 61, 299906, 61, 299912, 58, 299922, 55, 299928, 58, 299930, 55, 301697, 60, 301701, 60, 301705, 57, 301733, 52, 301737, 57, 301741, 52, 301952, 79, 301953, 79, 301960, 76, 301961, 76, 316038, 59, 316039, 59, 316054, 54, 316071, 51, 316086, 54, 316087, 51, 316290, 78, 316294, 78, 316306, 73, 316310, 73, 318085, 77, 318087, 77, 318117, 70, 318119, 70, 318336, 79, 318337, 79, 318338, 78, 318341, 77, 318342, 78, 318343, 77, 430776, 56, 430777, 56, 430778, 53, 430781, 50, 430782, 53, 430783, 50, 431000, 75, 431002, 72, 431032, 75, 431034, 72, 432809, 74, 432813, 69, 432825, 74, 432829, 69, 433032, 76, 433033, 76, 433048, 75, 433065, 74, 433080, 75, 433081, 74, 447158, 71, 447159, 68, 447166, 71, 447167, 68, 447378, 73, 447382, 73, 447386, 72, 447414, 71, 447418, 72, 447422, 71, 449189, 70, 449191, 70, 449197, 69, 449207, 68, 449213, 69, 449215, 68, 449408, 67, 449409, 67, 449410, 66, 449413, 64, 449414, 66, 449415, 64, 449416, 67, 449417, 67, 449426, 66, 449430, 66, 449432, 65, 449434, 65, 449445, 64, 449447, 64, 449449, 63, 449453, 63, 449462, 62, 449463, 62, 449464, 65, 449465, 63, 449466, 65, 449469, 63, 449470, 62, 449471, 62, 449472, 19, 449473, 19, 449474, 18, 449477, 16, 449478, 18, 449479, 16, 449480, 19, 449481, 19, 449490, 18, 449494, 18, 449496, 17, 449498, 17, 449509, 16, 449511, 16, 449513, 15, 449517, 15, 449526, 14, 449527, 14, 449528, 17, 449529, 15, 449530, 17, 449533, 15, 449534, 14, 449535, 14, 449728, 19, 449729, 19, 449730, 18, 449734, 18, 449736, 19, 449737, 19, 449746, 18, 449750, 18, 449752, 17, 449754, 17, 449784, 17, 449786, 17, 451520, 19, 451521, 19, 451525, 16, 451527, 16, 451528, 19, 451529, 19, 451557, 16, 451559, 16, 451561, 15, 451565, 15, 451577, 15, 451581, 15, 451776, 19, 451777, 19, 451784, 19, 451785, 19, 465858, 18, 465861, 16, 465862, 18, 465863, 16, 465874, 18, 465878, 18, 465893, 16, 465895, 16, 465910, 14, 465911, 14, 465918, 14, 465919, 14, 466114, 18, 466118, 18, 466130, 18, 466134, 18, 467909, 16, 467911, 16, 467941, 16, 467943, 16, 468160, 13, 468161, 13, 468162, 13, 468163, 13, 468164, 13, 468165, 13, 468166, 13, 468167, 13, 580568, 17, 580570, 17, 580585, 15, 580589, 15, 580598, 14, 580599, 14, 580600, 17, 580601, 15, 580602, 17, 580605, 15, 580606, 14, 580607, 14, 580824, 17, 580826, 17, 580856, 17, 580858, 17, 582633, 15, 582637, 15, 582649, 15, 582653, 15, 582856, 12, 582857, 12, 582872, 12, 582873, 12, 582888, 12, 582889, 12, 582904, 12, 582905, 12, 596982, 14, 596983, 14, 596990, 14, 596991, 14, 597202, 11, 597206, 11, 597210, 11, 597214, 11, 597234, 11, 597238, 11, 597242, 11, 597246, 11, 599013, 10, 599015, 10, 599021, 10, 599023, 10, 599029, 10, 599031, 10, 599037, 10, 599039, 10, 599232, 13, 599233, 13, 599234, 13, 599235, 13, 599236, 13, 599237, 13, 599238, 13, 599239, 13, 599240, 12, 599241, 12, 599250, 11, 599254, 11, 599256, 12, 599257, 12, 599258, 11, 599262, 11, 599269, 10, 599271, 10, 599272, 12, 599273, 12, 599277, 10, 599279, 10, 599282, 11, 599285, 10, 599286, 11, 599287, 10, 599288, 12, 599289, 12, 599290, 11, 599293, 10, 599294, 11, 599295, 10];
exports.p2D = [0, 0, 1, -1, 0, 0, -1, 1, 0, 2, 1, 1, 1, 2, 2, 0, 1, 2, 0, 2, 1, 0, 0, 0];
exports.p3D = [0, 0, 1, -1, 0, 0, 1, 0, -1, 0, 0, -1, 1, 0, 0, 0, 1, -1, 0, 0, -1, 0, 1, 0, 0, -1, 1, 0, 2, 1, 1, 0, 1, 1, 1, -1, 0, 2, 1, 0, 1, 1, 1, -1, 1, 0, 2, 0, 1, 1, 1, -1, 1, 1, 1, 3, 2, 1, 0, 3, 1, 2, 0, 1, 3, 2, 0, 1, 3, 1, 0, 2, 1, 3, 0, 2, 1, 3, 0, 1, 2, 1, 1, 1, 0, 0, 2, 2, 0, 0, 1, 1, 0, 1, 0, 2, 0, 2, 0, 1, 1, 0, 0, 1, 2, 0, 0, 2, 2, 0, 0, 0, 0, 1, 1, -1, 1, 2, 0, 0, 0, 0, 1, -1, 1, 1, 2, 0, 0, 0, 0, 1, 1, 1, -1, 2, 3, 1, 1, 1, 2, 0, 0, 2, 2, 3, 1, 1, 1, 2, 2, 0, 0, 2, 3, 1, 1, 1, 2, 0, 2, 0, 2, 1, 1, -1, 1, 2, 0, 0, 2, 2, 1, 1, -1, 1, 2, 2, 0, 0, 2, 1, -1, 1, 1, 2, 0, 0, 2, 2, 1, -1, 1, 1, 2, 0, 2, 0, 2, 1, 1, 1, -1, 2, 2, 0, 0, 2, 1, 1, 1, -1, 2, 0, 2, 0];
exports.p4D = [0, 0, 1, -1, 0, 0, 0, 1, 0, -1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 1, 0, 0, 0, 0, 1, -1, 0, 0, 0, 1, 0, -1, 0, 0, -1, 0, 1, 0, 0, 0, -1, 1, 0, 0, 0, 0, 1, -1, 0, 0, -1, 0, 0, 1, 0, 0, -1, 0, 1, 0, 0, 0, -1, 1, 0, 2, 1, 1, 0, 0, 1, 1, 1, -1, 0, 1, 1, 1, 0, -1, 0, 2, 1, 0, 1, 0, 1, 1, -1, 1, 0, 1, 1, 0, 1, -1, 0, 2, 0, 1, 1, 0, 1, -1, 1, 1, 0, 1, 0, 1, 1, -1, 0, 2, 1, 0, 0, 1, 1, 1, -1, 0, 1, 1, 1, 0, -1, 1, 0, 2, 0, 1, 0, 1, 1, -1, 1, 0, 1, 1, 0, 1, -1, 1, 0, 2, 0, 0, 1, 1, 1, -1, 0, 1, 1, 1, 0, -1, 1, 1, 1, 4, 2, 1, 1, 0, 4, 1, 2, 1, 0, 4, 1, 1, 2, 0, 1, 4, 2, 1, 0, 1, 4, 1, 2, 0, 1, 4, 1, 1, 0, 2, 1, 4, 2, 0, 1, 1, 4, 1, 0, 2, 1, 4, 1, 0, 1, 2, 1, 4, 0, 2, 1, 1, 4, 0, 1, 2, 1, 4, 0, 1, 1, 2, 1, 2, 1, 1, 0, 0, 3, 2, 1, 0, 0, 3, 1, 2, 0, 0, 1, 2, 1, 0, 1, 0, 3, 2, 0, 1, 0, 3, 1, 0, 2, 0, 1, 2, 0, 1, 1, 0, 3, 0, 2, 1, 0, 3, 0, 1, 2, 0, 1, 2, 1, 0, 0, 1, 3, 2, 0, 0, 1, 3, 1, 0, 0, 2, 1, 2, 0, 1, 0, 1, 3, 0, 2, 0, 1, 3, 0, 1, 0, 2, 1, 2, 0, 0, 1, 1, 3, 0, 0, 2, 1, 3, 0, 0, 1, 2, 2, 3, 1, 1, 1, 0, 2, 1, 1, 1, -1, 2, 2, 0, 0, 0, 2, 3, 1, 1, 0, 1, 2, 1, 1, -1, 1, 2, 2, 0, 0, 0, 2, 3, 1, 0, 1, 1, 2, 1, -1, 1, 1, 2, 2, 0, 0, 0, 2, 3, 1, 1, 1, 0, 2, 1, 1, 1, -1, 2, 0, 2, 0, 0, 2, 3, 1, 1, 0, 1, 2, 1, 1, -1, 1, 2, 0, 2, 0, 0, 2, 3, 0, 1, 1, 1, 2, -1, 1, 1, 1, 2, 0, 2, 0, 0, 2, 3, 1, 1, 1, 0, 2, 1, 1, 1, -1, 2, 0, 0, 2, 0, 2, 3, 1, 0, 1, 1, 2, 1, -1, 1, 1, 2, 0, 0, 2, 0, 2, 3, 0, 1, 1, 1, 2, -1, 1, 1, 1, 2, 0, 0, 2, 0, 2, 3, 1, 1, 0, 1, 2, 1, 1, -1, 1, 2, 0, 0, 0, 2, 2, 3, 1, 0, 1, 1, 2, 1, -1, 1, 1, 2, 0, 0, 0, 2, 2, 3, 0, 1, 1, 1, 2, -1, 1, 1, 1, 2, 0, 0, 0, 2, 2, 1, 1, 1, -1, 0, 1, 1, 1, 0, -1, 0, 0, 0, 0, 0, 2, 1, 1, -1, 1, 0, 1, 1, 0, 1, -1, 0, 0, 0, 0, 0, 2, 1, -1, 1, 1, 0, 1, 0, 1, 1, -1, 0, 0, 0, 0, 0, 2, 1, 1, -1, 0, 1, 1, 1, 0, -1, 1, 0, 0, 0, 0, 0, 2, 1, -1, 1, 0, 1, 1, 0, 1, -1, 1, 0, 0, 0, 0, 0, 2, 1, -1, 0, 1, 1, 1, 0, -1, 1, 1, 0, 0, 0, 0, 0, 2, 1, 1, 1, -1, 0, 1, 1, 1, 0, -1, 2, 2, 0, 0, 0, 2, 1, 1, -1, 1, 0, 1, 1, 0, 1, -1, 2, 2, 0, 0, 0, 2, 1, 1, -1, 0, 1, 1, 1, 0, -1, 1, 2, 2, 0, 0, 0, 2, 1, 1, 1, -1, 0, 1, 1, 1, 0, -1, 2, 0, 2, 0, 0, 2, 1, -1, 1, 1, 0, 1, 0, 1, 1, -1, 2, 0, 2, 0, 0, 2, 1, -1, 1, 0, 1, 1, 0, 1, -1, 1, 2, 0, 2, 0, 0, 2, 1, 1, -1, 1, 0, 1, 1, 0, 1, -1, 2, 0, 0, 2, 0, 2, 1, -1, 1, 1, 0, 1, 0, 1, 1, -1, 2, 0, 0, 2, 0, 2, 1, -1, 0, 1, 1, 1, 0, -1, 1, 1, 2, 0, 0, 2, 0, 2, 1, 1, -1, 0, 1, 1, 1, 0, -1, 1, 2, 0, 0, 0, 2, 2, 1, -1, 1, 0, 1, 1, 0, 1, -1, 1, 2, 0, 0, 0, 2, 2, 1, -1, 0, 1, 1, 1, 0, -1, 1, 1, 2, 0, 0, 0, 2, 3, 1, 1, 0, 0, 0, 2, 2, 0, 0, 0, 2, 1, 1, 1, -1, 3, 1, 0, 1, 0, 0, 2, 0, 2, 0, 0, 2, 1, 1, 1, -1, 3, 1, 0, 0, 1, 0, 2, 0, 0, 2, 0, 2, 1, 1, 1, -1, 3, 1, 1, 0, 0, 0, 2, 2, 0, 0, 0, 2, 1, 1, -1, 1, 3, 1, 0, 1, 0, 0, 2, 0, 2, 0, 0, 2, 1, 1, -1, 1, 3, 1, 0, 0, 0, 1, 2, 0, 0, 0, 2, 2, 1, 1, -1, 1, 3, 1, 1, 0, 0, 0, 2, 2, 0, 0, 0, 2, 1, -1, 1, 1, 3, 1, 0, 0, 1, 0, 2, 0, 0, 2, 0, 2, 1, -1, 1, 1, 3, 1, 0, 0, 0, 1, 2, 0, 0, 0, 2, 2, 1, -1, 1, 1, 3, 1, 0, 1, 0, 0, 2, 0, 2, 0, 0, 2, -1, 1, 1, 1, 3, 1, 0, 0, 1, 0, 2, 0, 0, 2, 0, 2, -1, 1, 1, 1, 3, 1, 0, 0, 0, 1, 2, 0, 0, 0, 2, 2, -1, 1, 1, 1, 3, 3, 2, 1, 0, 0, 3, 1, 2, 0, 0, 4, 1, 1, 1, 1, 3, 3, 2, 0, 1, 0, 3, 1, 0, 2, 0, 4, 1, 1, 1, 1, 3, 3, 0, 2, 1, 0, 3, 0, 1, 2, 0, 4, 1, 1, 1, 1, 3, 3, 2, 0, 0, 1, 3, 1, 0, 0, 2, 4, 1, 1, 1, 1, 3, 3, 0, 2, 0, 1, 3, 0, 1, 0, 2, 4, 1, 1, 1, 1, 3, 3, 0, 0, 2, 1, 3, 0, 0, 1, 2, 4, 1, 1, 1, 1, 3, 3, 2, 1, 0, 0, 3, 1, 2, 0, 0, 2, 1, 1, 1, -1, 3, 3, 2, 0, 1, 0, 3, 1, 0, 2, 0, 2, 1, 1, 1, -1, 3, 3, 0, 2, 1, 0, 3, 0, 1, 2, 0, 2, 1, 1, 1, -1, 3, 3, 2, 1, 0, 0, 3, 1, 2, 0, 0, 2, 1, 1, -1, 1, 3, 3, 2, 0, 0, 1, 3, 1, 0, 0, 2, 2, 1, 1, -1, 1, 3, 3, 0, 2, 0, 1, 3, 0, 1, 0, 2, 2, 1, 1, -1, 1, 3, 3, 2, 0, 1, 0, 3, 1, 0, 2, 0, 2, 1, -1, 1, 1, 3, 3, 2, 0, 0, 1, 3, 1, 0, 0, 2, 2, 1, -1, 1, 1, 3, 3, 0, 0, 2, 1, 3, 0, 0, 1, 2, 2, 1, -1, 1, 1, 3, 3, 0, 2, 1, 0, 3, 0, 1, 2, 0, 2, -1, 1, 1, 1, 3, 3, 0, 2, 0, 1, 3, 0, 1, 0, 2, 2, -1, 1, 1, 1, 3, 3, 0, 0, 2, 1, 3, 0, 0, 1, 2, 2, -1, 1, 1, 1];
},{}],"4bsIB":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sceneBuild = sceneBuild;
exports.sceneGroups = sceneGroups;
exports.sceneGroup = sceneGroup;
exports.sceneSelectIndex = sceneSelectIndex;
exports.sceneGrpSelectIndex = sceneGrpSelectIndex;
exports.sceneGrpSelectId = sceneGrpSelectId;
exports.sceneGrpGetId = sceneGrpGetId;
exports.sceneGetId = sceneGetId;
exports.sceneSelectId = sceneSelectId;
exports.sceneExportToGlobal = sceneExportToGlobal;
exports.Scene = void 0;

var _ticker = require("./ticker");

//function based switching mechanisim
var scene_groups = {};

class Scene {
  constructor(updateFunc, grpId, id, updateThreshold, init) {
    init = init || (s => {});

    grpId = grpId || "default";

    if (grpId) {
      scene_groups[grpId] = scene_groups[grpId] || [];
      scene_groups[grpId].push(this);
      this.index = scene_groups[grpId].length - 1;
    }

    this.visibility = (0, _ticker.eased)(0, 0, 0.2, 0.00001);
    this.updateThreshold = updateThreshold || 0.001;
    this.id = id;

    this.update = updateFunc || (() => {});

    init(this);
    (0, _ticker.loop)((t, dt) => {
      if (this.visibility.value > this.updateThreshold) {
        this.update(t, dt, this);
      }
    });
  }

}

exports.Scene = Scene;

function sceneBuild(update, grpId, id, init) {
  var s = new Scene(update, grpId, id, undefined, init);
  return s;
}

function sceneGroups() {
  return scene_groups;
}

function sceneGroup(grpId) {
  return scene_groups[grpId];
}

function sceneSelectIndex(arr, selection, exclusive) {
  for (var i = 0; i < arr.length; i++) {
    if (i == selection) {
      arr[i].visibility.to = 1;
    } else if (exclusive) {
      arr[i].visibility.to = 0;
    }
  }
}

function sceneGrpSelectIndex(str, selection, exclusive) {
  if (!scene_groups[str]) return;
  var arr = scene_groups[str];
  sceneSelectIndex(arr, selection, exclusive);
}

function sceneGrpSelectId(str, selection, exclusive) {
  if (!scene_groups[str]) return;
  var arr = scene_groups[str];
  sceneSelectId(arr, selection, exclusive);
}

function sceneGrpGetId(str, selection) {
  if (!scene_groups[str]) return;
  var arr = scene_groups[str];
  return sceneGetId(arr, selection);
}

function sceneGetId(arr, id) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].id == id) {
      return arr[i];
    }
  }
}

function sceneSelectId(arr, id, exclusive) {
  if (!arr) return;

  for (var i = 0; i < arr.length; i++) {
    if (arr[i].id == id) {
      arr[i].visibility.to = 1;
    } else if (exclusive) {
      arr[i].visibility.to = 0;
    }
  }
}

function sceneExportToGlobal(global) {
  global = global || window;
  global.sceneSelectId = sceneSelectId;
  global.sceneBuild = sceneBuild;
  global.sceneGroups = sceneGroups;
  global.sceneGrpSelectId = sceneGrpSelectId;
  global.sceneGrpSelectIndex = sceneGrpSelectIndex;
  global.sceneSelectIndex = sceneSelectIndex;
  global.sceneGroup = sceneGroup;
  global.scene_groups = scene_groups;
}
},{"./ticker":"6urOt"}],"5xQWU":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.eventPub = eventPub;
exports.EventEmitter = void 0;

var _eventemitter = _interopRequireDefault(require("eventemitter3"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EventEmitter = _eventemitter.default;
exports.EventEmitter = EventEmitter;

function eventPub() {
  var cbs = [];

  var trigger = function (cb) {
    //trigger
    if (cbs.indexOf(cb) == -1) {
      cbs.push(cb);
    }
  };

  trigger.emit = function () {
    var args = [];

    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }

    for (var i = 0; i < cbs.length; i++) {
      cbs[i].apply(null, args);
    }
  };

  return trigger;
}
},{"eventemitter3":"2mF7B"}],"2mF7B":[function(require,module,exports) {
'use strict';

var has = Object.prototype.hasOwnProperty,
    prefix = '~';
/**
 * Constructor to create a storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 *
 * @constructor
 * @private
 */

function Events() {} //
// We try to not inherit from `Object.prototype`. In some engines creating an
// instance in this way is faster than calling `Object.create(null)` directly.
// If `Object.create(null)` is not supported we prefix the event names with a
// character to make sure that the built-in object properties are not
// overridden or used as an attack vector.
//


if (Object.create) {
  Events.prototype = Object.create(null); //
  // This hack is needed because the `__proto__` property is still inherited in
  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
  //

  if (!new Events().__proto__) prefix = false;
}
/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @private
 */


function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}
/**
 * Add a listener for a given event.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} once Specify if the listener is a one-time listener.
 * @returns {EventEmitter}
 * @private
 */


function addListener(emitter, event, fn, context, once) {
  if (typeof fn !== 'function') {
    throw new TypeError('The listener must be a function');
  }

  var listener = new EE(fn, context || emitter, once),
      evt = prefix ? prefix + event : event;
  if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);else emitter._events[evt] = [emitter._events[evt], listener];
  return emitter;
}
/**
 * Clear event by name.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} evt The Event name.
 * @private
 */


function clearEvent(emitter, evt) {
  if (--emitter._eventsCount === 0) emitter._events = new Events();else delete emitter._events[evt];
}
/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @public
 */


function EventEmitter() {
  this._events = new Events();
  this._eventsCount = 0;
}
/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 * @public
 */


EventEmitter.prototype.eventNames = function eventNames() {
  var names = [],
      events,
      name;
  if (this._eventsCount === 0) return names;

  for (name in events = this._events) {
    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
  }

  if (Object.getOwnPropertySymbols) {
    return names.concat(Object.getOwnPropertySymbols(events));
  }

  return names;
};
/**
 * Return the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Array} The registered listeners.
 * @public
 */


EventEmitter.prototype.listeners = function listeners(event) {
  var evt = prefix ? prefix + event : event,
      handlers = this._events[evt];
  if (!handlers) return [];
  if (handlers.fn) return [handlers.fn];

  for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
    ee[i] = handlers[i].fn;
  }

  return ee;
};
/**
 * Return the number of listeners listening to a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Number} The number of listeners.
 * @public
 */


EventEmitter.prototype.listenerCount = function listenerCount(event) {
  var evt = prefix ? prefix + event : event,
      listeners = this._events[evt];
  if (!listeners) return 0;
  if (listeners.fn) return 1;
  return listeners.length;
};
/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @public
 */


EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  var evt = prefix ? prefix + event : event;
  if (!this._events[evt]) return false;
  var listeners = this._events[evt],
      len = arguments.length,
      args,
      i;

  if (listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

    switch (len) {
      case 1:
        return listeners.fn.call(listeners.context), true;

      case 2:
        return listeners.fn.call(listeners.context, a1), true;

      case 3:
        return listeners.fn.call(listeners.context, a1, a2), true;

      case 4:
        return listeners.fn.call(listeners.context, a1, a2, a3), true;

      case 5:
        return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;

      case 6:
        return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len - 1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length,
        j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

      switch (len) {
        case 1:
          listeners[i].fn.call(listeners[i].context);
          break;

        case 2:
          listeners[i].fn.call(listeners[i].context, a1);
          break;

        case 3:
          listeners[i].fn.call(listeners[i].context, a1, a2);
          break;

        case 4:
          listeners[i].fn.call(listeners[i].context, a1, a2, a3);
          break;

        default:
          if (!args) for (j = 1, args = new Array(len - 1); j < len; j++) {
            args[j - 1] = arguments[j];
          }
          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }

  return true;
};
/**
 * Add a listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */


EventEmitter.prototype.on = function on(event, fn, context) {
  return addListener(this, event, fn, context, false);
};
/**
 * Add a one-time listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */


EventEmitter.prototype.once = function once(event, fn, context) {
  return addListener(this, event, fn, context, true);
};
/**
 * Remove the listeners of a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {*} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @public
 */


EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
  var evt = prefix ? prefix + event : event;
  if (!this._events[evt]) return this;

  if (!fn) {
    clearEvent(this, evt);
    return this;
  }

  var listeners = this._events[evt];

  if (listeners.fn) {
    if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) {
      clearEvent(this, evt);
    }
  } else {
    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
      if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) {
        events.push(listeners[i]);
      }
    } //
    // Reset the array, or remove it completely if we have no more listeners.
    //


    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;else clearEvent(this, evt);
  }

  return this;
};
/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {(String|Symbol)} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @public
 */


EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  var evt;

  if (event) {
    evt = prefix ? prefix + event : event;
    if (this._events[evt]) clearEvent(this, evt);
  } else {
    this._events = new Events();
    this._eventsCount = 0;
  }

  return this;
}; //
// Alias methods names because people roll like that.
//


EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on; //
// Expose the prefix.
//

EventEmitter.prefixed = prefix; //
// Allow `EventEmitter` to be imported as module namespace.
//

EventEmitter.EventEmitter = EventEmitter; //
// Expose the module.
//

if ('undefined' !== typeof module) {
  module.exports = EventEmitter;
}
},{}],"6aAaW":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configFromHash = configFromHash;

function configFromHash() {
  var h = location.hash;
  if (!h) return {};
  h = decodeURIComponent(h);
  h = h.replace("#", "");
  h = h.split("&");
  var obj = {};

  for (var kv = 0; kv < h.length; kv++) {
    var flag = h[kv].split("=");

    if (flag.length == 1) {
      obj[flag[0]] = true;
    } else {
      obj[flag[0]] = flag[1];
    }
  }

  return obj;
}
},{}],"hYsxq":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Promise_Queue_Settings = Promise_Queue_Settings;
exports.Promise_Queue = Promise_Queue;
exports.fetchJSON = fetchJSON;
exports.fetchText = fetchText;
exports.QPS = void 0;

var _qps = _interopRequireDefault(require("qps"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var QPS = _qps.default;
exports.QPS = QPS;
var _promise_queues = {};

function Promise_Queue_Settings(_queue_name, concurrent_max, interval, qps) {
  _promise_queues[_queue_name] = _promise_queues[_queue_name] || [];
  _promise_queues[_queue_name].__min_interval = interval || undefined;
  _promise_queues[_queue_name].__lim_qps = qps || undefined;
  _promise_queues[_queue_name].__max_con = concurrent_max || undefined;
}

function p_q_add(_queue_name, __cur) {
  _promise_queues[_queue_name] = _promise_queues[_queue_name] || [];

  if (_promise_queues[_queue_name].__id == undefined) {
    _promise_queues[_queue_name].__id = 0;
  }

  if (_promise_queues[_queue_name].__last_call == undefined) {
    _promise_queues[_queue_name].__last_call = 0;
  }

  if (_promise_queues[_queue_name].__working == undefined) {
    _promise_queues[_queue_name].__working = [];
  }

  if (_promise_queues[_queue_name].__qps == undefined) {
    _promise_queues[_queue_name].__qps = new _qps.default();
  }

  __cur.__id = _promise_queues[_queue_name].__id++;

  _promise_queues[_queue_name].unshift(__cur);

  p_q_next(_promise_queues[_queue_name]); //start the queue if needed
}

function p_q_next(queue) {
  if (!queue || queue.length == 0) return; //done

  if (queue.__max_con && queue.__working.length > queue.__max_con) {
    console.warn("Promise_Queue", "CONCURRENCY LIM", queue.__max_con);
    return;
  }

  if (queue.__min_interval && Date.now() - queue.__last_call <= queue.__min_interval) {
    var next = Math.max(100, queue.__min_interval - (Date.now() - queue.__last_call));
    clearTimeout(queue.__timeout);
    console.warn("Promise_Queue", "INTERVAL THROTTLE", next);
    queue.__timeout = setTimeout(() => {
      p_q_next(queue);
    }, next);
    return;
  }

  if (queue.__lim_qps && queue.__qps.get() >= queue.__lim_qps) {
    clearTimeout(queue.__timeout);
    console.warn("Promise_Queue", "QPS THROTTLE", queue.__qps.get(), queue.__lim_qps);
    queue.__timeout = setTimeout(() => {
      p_q_next(queue);
    }, 100);
    return;
  }

  var _next = queue.pop();

  var id = _next.__id;

  queue.__working.push(id);

  queue.__qps.plus(1);

  queue.__last_call = Date.now();

  _next(() => {
    var index = queue.__working.indexOf(id);

    queue.__working = queue.__working.splice(index, 1);
    p_q_next(queue);
  });
}

function Promise_Queue(return_promise, _queue_name) {
  _queue_name = _queue_name || "default";
  var promise = new Promise((res, rej) => {
    function actual_work(__done) {
      return_promise().then(data => {
        res(data);

        __done();
      }, e => {
        rej(data);

        __done();
      });
    }

    p_q_add(_queue_name, actual_work);
  });
  return promise;
}

function fetchJSON(v, cb) {
  var key = v.split('/').pop().replace(/\.json/gi, "");
  return fetch(v).then(r => {
    // console.log("Loaded", v)
    return r.json();
  }).then(t => {
    // console.log("Parsed", v)
    if (typeof cb == 'object') {
      cb[key] = t;
    } else {
      cb(key, t, v);
    }
  });
}

function fetchText(v, cb) {
  var key = v.split('/').pop().replace(/\.json/gi, "");
  return fetch(v).then(r => {
    // console.log("Loaded", v)
    return r.text();
  }).then(t => {
    // console.log("Parsed", v)
    if (typeof cb == 'object') {
      cb[key] = t;
    } else {
      cb(key, t, v);
    }
  });
}
},{"qps":"2ulsy"}],"2ulsy":[function(require,module,exports) {
/**!
 * qps - index.js
 *
 * Copyright(c) 2014 fengmk2 and other contributors.
 * MIT Licensed
 *
 * Authors:
 *   fengmk2 <fengmk2@gmail.com> (http://fengmk2.github.com)
 */
"use strict";
/**
 * Module dependencies.
 */

module.exports = QPSCounter;

function QPSCounter(options) {
  if (!(this instanceof QPSCounter)) {
    return new QPSCounter(options);
  }

  this.ts = [[], []];
  this.counts = [[], []];
  this.tmpCounts = [];

  for (var i = 0; i < 60; i++) {
    this.counts[0][i] = 0;
    this.ts[0][i] = 0;
    this.counts[1][i] = 0;
    this.ts[1][i] = 0;
    this.tmpCounts[i] = 0;
  }

  this.timer;
  this.listener = options && options.listener; // listener for one minute before qps
  // listener format: `Function listener(qpsList)`

  if (this.listener) {
    this.timer = setInterval(this._onOneMinute.bind(this), 60000);
  }
}

var proto = QPSCounter.prototype;

proto.plus = function (count) {
  // plus()
  if (arguments.length === 0) {
    count = 1;
  }

  var now = new Date();
  var index = now.getMinutes() % 2;
  var second = now.getSeconds();
  var now = Date.now();

  if (now - this.ts[index][second] > 2000) {
    this.ts[index][second] = now;
    this.counts[index][second] = 0;
  }

  if (count > 0) {
    return this.counts[index][second] += count;
  } // plus(0) meaning get the qps


  return this.counts[index][second];
};

proto.get = function () {
  return this.plus(0);
};

proto.close = function () {
  if (this.timer) {
    clearInterval(this.timer);
    this.timer = null;
  }
};

proto.listAndResetOneMinuteBefore = function () {
  var now = new Date();
  var index = now.getMinutes() % 2;

  if (index === 0) {
    index = 1;
  } else {
    index = 0;
  }

  var cs = this.counts[index];

  for (var i = 0; i < cs.length; i++) {
    this.tmpCounts[i] = cs[i];
    cs[i] = 0;
  }

  return this.tmpCounts;
};

proto._onOneMinute = function () {
  this.listener(this.listAndResetOneMinuteBefore());
};
},{}],"7m5fI":[function(require,module,exports) {
// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}]},{},[], null, null)

//# sourceMappingURL=base-test.5558b556.js.map
