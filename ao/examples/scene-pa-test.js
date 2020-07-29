import * as ao from "libao";
import * as vue from "vue/dist/vue.esm-bundler";

import hello from "./hello.vue";

var Vue = vue;

/**
 * npm i parcel-bundler parcel-plugin-clean-dist vue @babel/core @vue/babel-preset-jsx @vue/babel-helper-vue-jsx-merge-props
 * 
 */

var data = {
    sep: {
        q: 3,
        root: 5,
    },
    test: ao.spring({
        damping: 0.9
    })
};

Vue.defineComponent('none', {
    functional: true,
    render() {
        return false;
    },
})

Vue.defineComponent('test', {
    props: ['q', 'i'],
    data: () => ({ x: ao.eased(0, 0, 0.5, 0.00001) }),
    mounted: function () {
        setInterval(() => {
            // this.x.to = Math.random();
        }, 3000);
        setInterval(function () {
            data.test.to = Math.random();
        }, 4000);
    },
    render() {
        console.log("re-render", this.i)
        return (<div>
            <div>
                {this.$slots.default}
            </div>
        </div>);
    },
})

const FunctionalTest = (state) => {
    //this is for declaritive dev
    var props = state.props;
    console.log(props.d);
    return <none></none>;
}



ao.looperStart();
window.data = data;

// Vue.createApp({
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



const demo = () => <div>Hello</div>

const test = (props) => {
    console.log(props, "hello")
    return (
        <>
            <div>
                {props.a}
            </div>
        </>
    )
};

const container = (props, ctx) => {
    console.log("render", ctx, props.i)
    return (
        <>
            <div>
                {props.i} <span>===</span> {props.j}
                {ctx.slots.default && ctx.slots.default()}
            </div>
        </>
    )
}

var gtest = Vue.reactive({
    a: 1,
    b: 1,
    c: 1,
    d: 1
});
window.gtest = gtest;

var app = Vue.createApp({
    render() {
        return (<div>
            <container i='1' j={gtest.a}>
                <container i='2' j={gtest.b}>
                    <container i='3' j={gtest.c}>
                        <container i='4' j={gtest.d}>
                        </container>
                    </container>
                </container>
            </container>
        </div>)
    },
    // template: `
    //     <div>
    //     </div>
    // `,
    setup() {
        const state = Vue.reactive({
            message: 'Hello Vue3!!'
        })
        setInterval(function () {
            gtest.test++;
            state.message += gtest.test;
        }, 1000);
        return {
            state
        }
    }
});

app.component('test', test);
app.component('hello', hello);

app.mount("#main");


// <app>
//     <canvas></canvas>
// </app>