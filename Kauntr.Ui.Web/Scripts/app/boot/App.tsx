import * as React from "react";
import * as ReactDOM from "react-dom";

class HelloWorldBoot extends React.Component<any, any> {
    render() {
        return (
            <h1>Hello, World!</h1>
        );
    }
}

ReactDOM.render(<HelloWorldBoot />, document.getElementById("app-container"));
