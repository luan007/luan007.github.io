import * as three from "three";
import { React, ReactDOM, observable, Observer, autoObserve } from "libao/react-base";
import * as ao from 'libao'

ao.sceneExportToGlobal();
ao.looperStart();

var data = observable({
    test: 0,
    test2: 0,
    eased: autoObserve(ao.eased(0, 0, 0.1, 0.0001))
});
window.data = data;


var Flow = React.memo(({ children }) => {
    console.log("c")
    return <div>{children}</div>
})

function App() {
    return (
        <div>
            <ao.blocks.Scene>
                {({ viz }) => (
                    <>
                        <Observer>
                            {_ => <Flow>{data.eased.value + data.test2}</Flow>}
                        </Observer>
                        <Observer>
                            {_ => <Flow>{data.test}</Flow>}
                        </Observer>
                    </>
                )}
            </ao.blocks.Scene>
        </div>)
}

ReactDOM.render(
    <App></App>,
    document.querySelector("#main")
)
