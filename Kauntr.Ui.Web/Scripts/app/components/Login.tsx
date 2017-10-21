import * as React from "react";
import { connect } from "react-redux";
import * as classNames from "classnames";

import {
    updateSharedContextTitle
} from "../actions/SharedContextActions";

import {
    requestAuthenticationTokenIfNeeded
} from "../actions/AuthenticationActions";

import AppState from "../interfaces/AppState";
import AuthenticationState from "../interfaces/AuthenticationState";

interface FormState {
    email: string;
    isValid: boolean;
}

export class Login extends React.Component<AuthenticationState, FormState> {
    constructor() {
        super();

        this.state = {
            email: "",
            isValid: false
        };
    }

    componentDidMount() {
        if (this.props.isAuthenticated) {
            const { router } = this.props;
            const { returnUrl } = router.location.query;
            router.push(returnUrl ? returnUrl : "/");
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

    private handleEmailInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        e.preventDefault();

        this.setState({
            email: e.target.value
        }, () => this.validateForm());
    }

    private handleFormSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        if (this.state.isValid) {
            const { dispatch, router } = this.props;
            dispatch(requestAuthenticationTokenIfNeeded(this.state.email, router.location.query.returnUrl));
        }
    }

    render() {
        const { isWaitingForEmailConfirmation } = this.props;
        return (
            <div className="animated fadeIn">
                <div className="row">
                    <h3>Login</h3>
                    <div className="text-medium-sub">
                        Awesome, you're almost there
                        <br />
                        login using your email
                    </div>
                    <p>(yeah, we don't use passwords)</p>
                    <form className={classNames("form-section", { "hidden": isWaitingForEmailConfirmation })} onSubmit={this.handleFormSubmit}>
                        <div>
                            <input type="text" className="input input-medium" placeholder="email" onChange={this.handleEmailInputChange} value={this.state.email} />
                        </div>
                        <button type="submit" className="button button-medium" disabled={!this.state.isValid}>Login</button>
                    </form>
                    <div className={classNames({ "hidden": !this.props.isWaitingForEmailConfirmation })}>
                        <div>We've sent you a login email, go check it out ...</div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state: AppState, ownProps: any): AuthenticationState {
    return {
        ...state.authentication,
        isAuthenticated: state.sharedContext.currentUserAccountId !== null
    };
}

export default connect(mapStateToProps, null)(Login);