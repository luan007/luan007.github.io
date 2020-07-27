import * as ao from "libao/core/index";
import * as React from "react";
import * as reactDOM from "react-dom";
import * as three from "three";
import { Canvas, useFrame, extend, render } from 'react-three-fiber';
import { observable, computed, action, extendObservable } from "mobx"
import { observer, Observer } from "mobx-react";
import { loop, noLoop, loopEffect } from "libao/core/index";

ao.looperStart();

function Call({ func = () => { } }) {
    React.useLayoutEffect(() => {
        func();
    }, []);
    return <></>
}

function Canvas2D({ children, ...props }) {
    return (<>
        {children}
    </>)
}

function CanvasFancyChart2D({ children, ...props }) {
    return <></>
}

function SpringBox(props) {

    var [pos, setPos] = React.useState(0);
    var spring = React.useMemo(() => {
        let spring = ao.spring({
            value: 0,
            to: 0,
            stiffness: 0.1,
            damping: 0.1
        });
        // spring = ao.eased(0, 0, 0.1);
        window.spring = spring;
        return spring;
    }, []);

    React.useEffect(ao.loopEffect(() => {
        setPos(spring.value)
        // console.log(spring.value);
        // if(Math.random() > 0.8) {
        //     spring.to = Math.random();
        // }
    }), []);

    return <div style={{
        height: 100,
        width: 100,
        backgroundColor: 'black',
        transform: `translate(${pos * 300}px, 0)`
    }}></div>

}

var obj = observable({
    rot: [
        [0, 0, 0],
        [1, 1, 1]
    ],
    b: 3,
    c: extendObservable(ao.spring({}), { value: 0 })
});

function RandomImage({ h = 300, w = 300, a = 0, b = 0, ...props }) {
    console.log('flowed', h, w, a, b)
    let [canvas, ctx] = React.useMemo(() => {
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext('2d');
        document.body.appendChild(canvas);
        return [canvas, ctx];
    }, [a]);

    React.useEffect(() => {
        canvas.width = w;
        canvas.height = h;
    }, [a, w, h]);

    React.useEffect(() => {
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`;
        ctx.fillRect(0, 0, w, h);
    }, [a, b, w, h]);

    return <></>
}

var MyBox = React.memo(({
    position = [0, 0, 0],
    k = 0,
    a = 0,
    w = 0,
    ...props
}) => {
    const ref = React.useRef(null)

    var [val, setVal] = React.useState(0);
    var spring = React.useMemo(() => ao.spring({}), []);
    window.spring2 = spring;

    React.useEffect(loopEffect(() => {
        setVal(spring.value);
    }), [])

    // var rot = [obj.rot[0], obj.rot[1], obj.rot[2]];
    return (
        <group ref={ref} position={position}  {...props}>
            {
                [0, 1, 2].map((v, i) => (<mesh key={'box_' + i} position={[0, 0, -5]}>
                    <boxGeometry args={[3, 3, 3]} attach="geometry"></boxGeometry>
                    <meshBasicMaterial color={[0, 0, 0]} attach="material"></meshBasicMaterial>
                    <Canvas2D>
                        <RandomImage v={5} a={a} w={w * val}></RandomImage>
                    </Canvas2D>
                </mesh>)
                )}
        </group>
    )
});

window.obj = obj;

function init_p5(canvas) {
    console.log(canvas);
}

function drawDot(ctx, x, y) {
    var c = ctx;
    c.fillStyle = "white";
    c.fillRect(x, y, 5, 5);
    console.log('work');
}

var DrawDot = React.memo(({ ctx, x, y, update, ...props }) => {
    if (ctx.current) {
        drawDot(ctx.current, x, y);
    }
    return <></>
});

var ClearCtx = React.memo(({ update, ctx }) => {
    if (ctx.current) {
        var c = ctx.current;
        c.fillStyle = `rgba(0, 0, 0, 0.1)`;
        c.fillRect(0, 0, 500, 500);
    }
    return <></>
})

var Observe = React.memo(observer(({ children }) =>
    children(0)
));


var Loop = ({ children }) => {
    var [s, setState] = React.useState(0);
    React.useEffect(loopEffect((t) => {
        setState(t);
    }), []);
    return children(s);
};

var NetworkEndpoint = React.memo(({ children }) => {
    var data = observable({
        chunk1: {
            value: 0
        },
        chunk0: {
            value: 0
        }
    });
    console.log("ready")
    //socket.io 
    //on('state', ()=>{data.xx = xx})
    return children(data);
});


var ApplicationLogic = React.memo(({ children }) => {
    var assembled = observable({
        state: {
            v: extendObservable(ao.spring({}), { value: 0 })
        }
    });
    window.obs = assembled;

    var actions = {
        inc: function () {
            assembled.state.v.to = Math.random();
        }
    };

    return (<>
        <NetworkEndpoint io="http://demo/1" ev="state">{(data) => { assembled["a"] = data }}</NetworkEndpoint>
        <NetworkEndpoint io="http://demo/2" ev="q">{(data) => { assembled["b"] = data }}</NetworkEndpoint>
        <NetworkEndpoint io="http://demo/3" ev="test">{(data) => { assembled["c"] = data }}</NetworkEndpoint>
        <NetworkEndpoint io="http://demo/4" ev="update">{(data) => { assembled["c"] = data }}</NetworkEndpoint>
        {children(assembled, actions)}
    </>)
});


// reactDOM.render(
var App = (() => {
    var ctx = {};
    return (
        <div style={
            {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            }
        }>
            <ApplicationLogic>
                {(data, actions) => (<>
                    <canvas width={300} height={300}
                        id="test"
                        ref={(i) => { ctx.current = i.getContext('2d'); }}></canvas>
                    <Observe>
                        {(s) => (<>
                            <ClearCtx update={data.state.v.value} ctx={ctx}></ClearCtx>
                            <DrawDot update={data.state.v.value}
                                x={data.state.v.value * 300}
                                y={data.state.v.value * data.state.v.value * 300}
                                ctx={ctx}></DrawDot>
                            <DrawDot update={data.state.v.value}
                                x={data.state.v.value * 100}
                                y={data.state.v.value * data.state.v.value * 200}
                                ctx={ctx}></DrawDot>
                        </>)}
                    </Observe>
                    <div>
                        <button onClick={() => { actions.inc() }}>Click Me</button>
                    </div>
                </>)}
            </ApplicationLogic>
        </div>
    )
});

reactDOM.render(<App></App>,
    document.querySelector("#main")
    , () => {
    })




{
    (data, actions) => (<>
        <canvas width={300} height={300} id="test" ref={(i) => { ctx.current = i.getContext('2d'); }}></canvas>
        <SpringBox></SpringBox>
        <Canvas>
            <Observe>
                {(s) => (<>
                    <MyBox a={obj.rot[0][0]} w={obj.rot[0][1]} position={[0, 0, -10]}></MyBox>
                </>)}
            </Observe>
        </Canvas>
        <Observe>
            {(s) => (<>
                <ClearCtx update={data.state.v.value} ctx={ctx}></ClearCtx>
                <DrawDot update={data.state.v.value} x={data.state.v.value * 300} y={data.state.v.value * data.state.v.value * 300} ctx={ctx}></DrawDot>
            </>)}
        </Observe>
        <Observe>
            {(s) => (<>
                <ClearCtx update={data.a.chunk1.value} ctx={ctx}></ClearCtx>
                <DrawDot update={data.a.chunk1.value} x={data.a.chunk1.value * 300} y={data.a.chunk1.value * data.a.chunk1.value * 300} ctx={ctx}></DrawDot>
            </>)}
        </Observe>
        <button onClick={() => { actions.inc() }}></button>
    </>)
}