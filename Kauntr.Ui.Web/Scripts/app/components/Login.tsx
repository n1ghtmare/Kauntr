import * as React from "react";
import { connect } from "react-redux";

import {
    updateSharedContextTitle
} from "../actions/SharedContextActions";

import {
    invalidateSendAuthenticationToken,
    sendAuthenticationTokenIfNeeded
} from "../actions/LoginActions";

import AppState from "../interfaces/AppState";
import LoginState from "../interfaces/LoginState";

export class Login extends React.Component<any, any> {
    componentDidMount() {
        this.props.dispatch(updateSharedContextTitle("login"));
    }

    private handleLoginClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const {dispatch} = this.props;

        dispatch(invalidateSendAuthenticationToken());

        // TODO - Validate input - perhaps place in form?
        // dispatch(sendAuthenticationTokenIfNeeded())
    }

    render() {
        return (
            <div className="main-section">
                <div>
                    <div>Awesome, you're almost there</div>
                    <div>login using your email</div>
                    <div className="text-small">(yeah, we don't use passwords)</div>
                    <input type="text" className="text-main text-main-desc" placeholder="email" ref="email" />
                </div>
                <button className="button button-main" onClick={this.handleLoginClick}>Login</button>
            </div>
        );
    }
}

export default connect()(Login);