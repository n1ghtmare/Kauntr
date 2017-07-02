import * as React from "react";
import { connect } from "react-redux";

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
            <div className="main-section">
                <div>
                    <div>Awesome, you're almost there</div>
                    <div>login using your email</div>
                    <div className="text-small">(yeah, we don't use passwords)</div>
                    <input type="text" className="text-main text-main-desc" placeholder="email" />
                </div>
                <button className="button button-main">Login</button>
            </div>
        );
    }
}

export default connect()(Login);