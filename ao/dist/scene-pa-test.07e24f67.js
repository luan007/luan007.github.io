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
})({"SXRg8":[function(require,module,exports) {
"use strict";

var _vue = _interopRequireWildcard(require("vue"));

var vue = _interopRequireWildcard(require("vue/dist/vue.esm-bundler"));

var _hello = _interopRequireDefault(require("./hello.vue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// import * as ao from "libao";
var Vue = vue;
/**
 * npm i parcel-bundler parcel-plugin-clean-dist vue @babel/core @vue/babel-preset-jsx @vue/babel-helper-vue-jsx-merge-props
 * 
 */

var data = {
  sep: {
    q: 3,
    root: 5
  },
  test: ao.spring({
    damping: 0.9
  })
};
Vue.defineComponent('none', {
  functional: true,

  render() {
    return false;
  }

});
Vue.defineComponent('test', {
  props: ['q', 'i'],
  data: () => ({
    x: ao.eased(0, 0, 0.5, 0.00001)
  }),
  mounted: function () {
    setInterval(() => {// this.x.to = Math.random();
    }, 3000);
    setInterval(function () {
      data.test.to = Math.random();
    }, 4000);
  },

  render() {
    console.log("re-render", this.i);
    return _vue.createVNode("div", null, [_vue.createVNode("div", null, [this.$slots.default])]);
  }

});

const FunctionalTest = state => {
  //this is for declaritive dev
  var props = state.props;
  console.log(props.d);
  return _vue.createVNode(_vue.resolveComponent("none"), null, null);
};

ao.looperStart();
window.data = data; // Vue.createApp({
//     render: function (h) {
//         return (
//             <div>
//                 <FunctionalTest d={data.test.value}></FunctionalTest>
//                 <test i={1} q={this.sep.root}>
//                     <div></div>
//                 </test>
//                 <test i={2} q={this.sep.q}>
//                 </test>
//             </div>
//         )
//     },
//     data: () => { return data; },
//     el: "#main"
// }).mount("#main");

var gtest = Vue.reactive({
  test: 1
});

const demo = () => _vue.createVNode("div", null, [_vue.createTextVNode("Hello")]);

const test = props => {
  console.log(props, "hello");
  return _vue.createVNode(_vue.Fragment, null, [_vue.createVNode("div", null, [_vue.createTextVNode("1")])]);
};

window.gtest = gtest;
var app = Vue.createApp({
  // render() {
  //     return (<div>
  //         <test a={this.state.message}></test>
  //         {this.state.message}
  //     </div>)
  // },
  template: `
        <div>
            <test :a='state.message'></test>
            {{state.message}}
        </div>
    `,

  setup() {
    const state = Vue.reactive({
      message: 'Hello Vue3!!'
    });
    setInterval(function () {
      gtest.test++;
      state.message += gtest.test;
    }, 1000);
    return {
      state
    };
  }

});
app.component('test', test);
app.mount("#main"); // <app>
//     <canvas></canvas>
// </app>
},{"vue":"6WHvo","vue/dist/vue.esm-bundler":"1tnda","./hello.vue":"1M55S"}],"1tnda":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  compile: true
};
exports.compile = compileToFunction;

var runtimeDom = _interopRequireWildcard(require("@vue/runtime-dom"));

Object.keys(runtimeDom).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return runtimeDom[key];
    }
  });
});

var _shared = require("@vue/shared");

var _compilerDom = require("@vue/compiler-dom");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function initDev() {
  const target = (0, _shared.getGlobalThis)();
  target.__VUE__ = true;
  (0, runtimeDom.setDevtoolsHook)(target.__VUE_DEVTOOLS_GLOBAL_HOOK__);
  {
    console.info(`You are running a development build of Vue.\n` + `Make sure to use the production build (*.prod.js) when deploying for production.`);
  }
} // This entry is the "full-build" that includes both the runtime


"development" !== 'production' && initDev();
const compileCache = Object.create(null);

function compileToFunction(template, options) {
  if (!(0, _shared.isString)(template)) {
    if (template.nodeType) {
      template = template.innerHTML;
    } else {
      "development" !== 'production' && (0, runtimeDom.warn)(`invalid template option: `, template);
      return _shared.NOOP;
    }
  }

  const key = template;
  const cached = compileCache[key];

  if (cached) {
    return cached;
  }

  if (template[0] === '#') {
    const el = document.querySelector(template);

    if ("development" !== 'production' && !el) {
      (0, runtimeDom.warn)(`Template element not found or is empty: ${template}`);
    } // __UNSAFE__
    // Reason: potential execution of JS expressions in in-DOM template.
    // The user must make sure the in-DOM template is trusted. If it's rendered
    // by the server, the template should not contain any user data.


    template = el ? el.innerHTML : ``;
  }

  const {
    code
  } = (0, _compilerDom.compile)(template, (0, _shared.extend)({
    hoistStatic: true,

    onError(err) {
      if ("development" !== 'production') {
        const message = `Template compilation error: ${err.message}`;
        const codeFrame = err.loc && (0, _shared.generateCodeFrame)(template, err.loc.start.offset, err.loc.end.offset);
        (0, runtimeDom.warn)(codeFrame ? `${message}\n${codeFrame}` : message);
      } else {
        /* istanbul ignore next */
        throw err;
      }
    }

  }, options)); // The wildcard import results in a huge object with every export
  // with keys that cannot be mangled, and can be quite heavy size-wise.
  // In the global build we know `Vue` is available globally so we can avoid
  // the wildcard object.

  const render = new Function('Vue', code)(runtimeDom);
  render._rc = true;
  return compileCache[key] = render;
}

(0, runtimeDom.registerRuntimeCompiler)(compileToFunction);
},{"@vue/runtime-dom":"5UfSj","@vue/shared":"5dCCC","@vue/compiler-dom":"3q2QC"}],"1M55S":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _hello = _interopRequireDefault(require("script:./hello.vue"));

var _hello2 = require("template:./hello.vue");

var _hello3 = _interopRequireDefault(require("style:./hello.vue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_hello.default.render = _hello2.render;
_hello.default.__cssModules = _hello3.default;
_hello.default.__file = `/Users/doge/Desktop/Work/luan007.github.io/ao/examples/hello.vue`;
var _default = _hello.default;
exports.default = _default;
},{"script:./hello.vue":"5X1dC","template:./hello.vue":"5WOOE","style:./hello.vue":"7kVV5"}],"5X1dC":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  props: ["test"]
};
exports.default = _default;
},{}],"5WOOE":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.render = render;

var _vue = require("vue");

function render(_ctx, _cache) {
  return (0, _vue.openBlock)(), (0, _vue.createBlock)("div", null, "HELLO OLD VUE " + (0, _vue.toDisplayString)(_ctx.test), 1);
}
},{"vue":"6WHvo"}],"7kVV5":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _hello = require("template:./hello.vue");

let cssModules = {};
var _default = cssModules;
exports.default = _default;
},{"template:./hello.vue":"5WOOE"}]},{},["SXRg8"], "SXRg8", null)

//# sourceMappingURL=scene-pa-test.07e24f67.js.map
