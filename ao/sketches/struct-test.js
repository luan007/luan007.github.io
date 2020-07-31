import * as ao from "./libao";
import * as three from "three";
import * as postprocessing from "postprocessing";

ao.test();
import * as vue from "vue/dist/vue.esm-bundler";

var wx = vue.reactive({
    test: 4
});

var q = function ({ test }, reactive) {
    console.log("render", test);
    //setup code
    //local variable
    var params = {
        test: 9,
        jjj: 1,
        ...arguments[0]
    };
    var meta = {
        test: { min: 0, max: 1 },
        jjj: { kind: 0 }
    }
    function update(params) {
        console.log("update", params.test)
    }
    if (reactive) {
        params = vue.reactive(params);
        vue.watch(params, update.bind(this, params));
    }
    return {
        params: params,
        meta: meta,
        update: update
    };
};

var toPureVue = function (factory) {
    return vue.defineComponent({
        setup(sth, q) {
            console.log(sth, q);
        },
        render(props) {
            console.log(JSON.stringify(props));
        }
    });
}

var test = toPureVue(() => { });
var test2 = vue.defineComponent({
    props: {
        test: { meta: 30 }
    },
    setup: function (_, ctx) {
        var state = q({ ..._, ...ctx.attrs }, false);
        return {
            state
        };
    },
    render: function (_, ctx) {
        _.state.update(_);
    }
}
);


window.wx = wx;

window.j = q({}, true);

var app = vue.createApp({
    render() {
        return <test2 test={wx.test}></test2>
    }
})
app.mount(document.body.querySelector("#main"));

//setup softshadow

//setup tonemapping

//renderer

//post

// ao.threeVSMShadow;
// ao.test();
