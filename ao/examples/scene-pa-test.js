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

var canvasCtx = (props, ctx) => {
    var canvas = props.canvas;
    var ctx2d = canvas.getContext('2d');
    console.log(ctx2d);
    vue.provide("ctx", ctx2d);
    return ctx.slots.default({});
};

var debug = (props, ctx) => {
    console.log(props, ctx);
};

var vif = (props, ctx) => {
    return (!!props.value && ctx.slots.default) ? (
        ctx.slots.default()
    ) : false;
}

var app = vue.createApp({
    render() {
        return (
            <>
                <canvas ref="canvasRef"></canvas>
                <vif value={this.canvasRef}>
                    <canvasCtx canvas={this.canvasRef}>
                        <div>hi</div>
                    </canvasCtx>
                </vif>
            </>
        )
    },
    setup() {
        var canvasRef = vue.ref();
        return {
            canvasRef
        }
    }
});

app.mount("#main");


// <app>
//     <canvas></canvas>
// </app>