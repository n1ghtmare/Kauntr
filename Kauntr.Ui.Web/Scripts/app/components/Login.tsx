import * as React from "react";
import {connect} from "react-redux";

import {
    updateSharedContextTitle
} from "../actions/SharedContextActions";

import AppState from "../interfaces/AppState";
import SharedContextState from "../interfaces/SharedContextState";

export class Login extends React.Component<any, any> {
    componentDidMount() {
        this.props.dispatch(updateSharedContextTitle("login"));
    }

    render() {
        return (
            <div>
                This is the Login Component
            </div>
        );
    }
}

export default connect()(Login);