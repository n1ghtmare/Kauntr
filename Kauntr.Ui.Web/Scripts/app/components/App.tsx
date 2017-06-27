import * as React from "react";
import {connect} from "react-redux";

import Header from "./Header";

export class App extends React.Component<any, any> {
    componentWillMount() {
        console.log("Will load the user state from the server");
        console.log(this.props);
        console.log(this.props.dispatch);
    }

    render() {
        return (
            <div>
                <Header />
                <div id="container" className="container">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default connect((state: any): any => {
    return state.account;
})(App);

