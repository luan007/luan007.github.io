import * as ao from "libao";
import * as vue from "vue/dist/vue.esm-bundler";

/**
 * npm i parcel-bundler parcel-plugin-clean-dist vue @babel/core @vue/babel-preset-jsx @vue/babel-helper-vue-jsx-merge-props
 */

ao.looperStart();

const staticComp = () => <div>Hello</div>

const container = (props, ctx) => {
    console.log("render", ctx, props.i, props.j)
    return (
        <>
            <div>
                {props.i} <span>===</span> {props.j}
                {ctx.slots.default && ctx.slots.default()}
            </div>
        </>
    )
}

var gtest = vue.reactive({
    a: 1,
    b: 1,
    c: 1,
    d: 1,
    e: 1
});
window.gtest = gtest;

{
    let app = vue.createApp({
        render() {
            var x = Math.floor(Math.random() * 10)
            return (<div>
                <container i='1' j={gtest.a}>
                    {new Array(x).fill(0, 0, x).map((v => (
                        <container i='2' j={gtest.b}>
                        </container>
                    )))}
                    {new Array(10).fill(0, 0, 10).map((v => (
                        <container i='3' j={gtest.c}>
                        </container>
                    )))}
                </container>
            </div>)
        },
        setup() {
        }
    });
}

var injector = vue.defineComponent({
    props: ['canvas'],
    setup() {
        vue.provide("paint", {
            canvas: null,
            ctx: null
        });
    },
    computed: {
        ctx() {
            return this.canvas.getContext('2d');
        }
    },
    template: `
        <slot></slot>
    `
});

var canvasCtx = (props, ctx) => {
    var canvas = props.canvas;
    var ctx2d = canvas.getContext('2d');
    return ctx.slots.default();
};

var paint = (props, ctx) => {
    console.log(props, ctx);
}

var debug = (props, ctx) => {
    console.log(props, ctx);
};

var vif = (props, ctx) => {
    return (!!props.value && ctx.slots.default) ? (
        ctx.slots.default()
    ) : false;
}

var graphical_canvas_a = vue.defineComponent({
    setup() {
        var canvas_ref = vue.ref();
        return {
            canvas_ref
        }
    },
    computed: {
        ctx() {
            return this.canvas_ref ? this.canvas_ref.getContext('2d') : null;
        }
    },
    render() {
        if (!this.ctx) {
            //do nothing
        }
        else {
            let ctx = this.ctx;
            ctx.clearRect(0, 0, 100, 100);
            ctx.fillRect(0, 0, 300, 300);
        }
        return (
            <canvas ref='canvas_ref'></canvas>
        );
    }
})

var app = vue.createApp({
    render() {
        return (
            <div>
                <graphical_canvas_a></graphical_canvas_a>
            </div>
        )
    }
});

app.component('injector', injector);
app.mount("#main");


// <app>
//     <canvas></canvas>
// </app>