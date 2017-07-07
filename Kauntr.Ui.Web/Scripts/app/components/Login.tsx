import * as React from "react";
import { connect } from "react-redux";
import * as classNames from "classnames";

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

export class Login extends React.Component<LoginState, FormState> {
    constructor() {
        super();

        this.state = {
            email: "",
            isValid: false
        };
    }

    componentDidMount() {
        if (this.props.isAuthenticated) {
            this.props.router.push("/");
        }
        this.props.dispatch(updateSharedContextTitle("login"));
    }

    validateForm(): void {
        // This is just a very basic email address reg-ex (rest will be done on server). TODO - perhaps get a better one? * research
        const emailRegEx: RegExp = /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i;
        this.setState({
            isValid: emailRegEx.test(this.state.email)
        });
    }

    private handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (this.state.isValid) {
            const { dispatch, router } = this.props;
            dispatch(invalidateSendAuthenticationToken());
            dispatch(sendAuthenticationTokenIfNeeded(this.state.email, router.location.query.returnUrl));
        }
    }

    private handleEmailInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        this.setState({
            email: e.target.value
        }, () => this.validateForm());
    }

    render() {
        const { isWaitingForEmailConfirmation } = this.props;
        return (
            <div className="main-section">
                <form className={classNames({ "hidden": isWaitingForEmailConfirmation })} onSubmit={this.handleFormSubmit}>
                    <div>
                        <div>Awesome, you're almost there</div>
                        <div>login using your email</div>
                        <div className="text-small">(yeah, we don't use passwords)</div>
                        <div className={classNames("text-small text-error", { "hidden": this.props.error === null })}>
                            <p>Hmmm, something went wrong. Either the email is invalid, or you have too many login attempts.</p>
                            <p>Try again later or contact us at <a href="mailto:support@kauntr.com">support@kauntr.com</a> if the issue persists.</p>
                        </div>
                        <input type="text" className="text-main text-main-desc" placeholder="email" onChange={this.handleEmailInputChange} value={this.state.email} />
                    </div>
                    <button type="submit" className="button button-main" disabled={!this.state.isValid}>Login</button>
                </form>
                <div className={classNames({ "hidden": !this.props.isWaitingForEmailConfirmation })}>
                    <div>We've sent you a login email, go check it out ...</div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state: AppState, ownProps: any): LoginState {
    return {
        isAuthenticated: state.sharedContext.currentUserId !== null,
        ...state.login
    };
}
export default connect(mapStateToProps)(Login);