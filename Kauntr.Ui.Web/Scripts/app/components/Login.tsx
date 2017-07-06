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

interface FormState {
    email: string;
    isValid: boolean;
}

export class Login extends React.Component<any, FormState> {
    constructor() {
        super();

        this.state = {
            email: "",
            isValid: false
        };
    }

    componentDidMount() {
        this.props.dispatch(updateSharedContextTitle("login"));
    }

    validateForm() : void {
        // This is just a very basic email address reg-ex (rest will be done on server). TODO - perhaps get a better one? * research
        const emailRegEx: RegExp = /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i;
        this.setState({
            isValid: emailRegEx.test(this.state.email)
        });
    }

    private handleFormSubmit = () => {
        if(this.state.isValid) {
            console.log("WILL SUBMIT FORM");
        }
    }

    private handleEmailInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        this.setState({
            email: e.target.value
        }, () => this.validateForm());
    }

    render() {
        return (
            <div className="main-section">
                <form onSubmit={this.handleFormSubmit}>
                <div>
                    <div>Awesome, you're almost there</div>
                    <div>login using your email</div>
                    <div className="text-small">(yeah, we don't use passwords)</div>
                    <input type="text" className="text-main text-main-desc" placeholder="email" onChange={this.handleEmailInputChange} value={this.state.email} />
                </div>
                <button type="submit" className="button button-main" disabled={!this.state.isValid}>Login</button>
                </form>
            </div>
        );
    }
}

export default connect()(Login);