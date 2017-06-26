import * as React from "react";
import {connect} from "react-redux";

export class App extends React.Component<any, any> {
    componentWillMount() {
        console.log("Will load the user state from the server");
        console.log(this.props);
        console.log(this.props.dispatch);
    }

    render() {
        return (
            <div>
                <div>This is going to be the menu</div>
                {this.props.children}
            </div>
        );
    }
}

export default connect((state: any): any => {
    return state.account;
})(App);

