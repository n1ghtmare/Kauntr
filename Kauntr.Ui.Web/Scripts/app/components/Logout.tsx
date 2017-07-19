import * as React from "react";
import { connect } from "react-redux";

import { logoutUserAccount } from "../actions/AuthenticationActions";

import AppState from "../interfaces/AppState";
import AuthenticationState from "../interfaces/AuthenticationState";

import LoadingIndicator from "./LoadingIndicator";
import Error from "./Error";

export class Logout extends React.Component<AuthenticationState, any> {
    componentDidMount() {
        const { dispatch, router } = this.props;

        dispatch(logoutUserAccount(router));
    }

    render() {
        return (
            this.props.error !== null
                ? (
                    <Error code={this.props.error} subMessage={"oh snap! Something went wrong."}>
                        <div className="text-error">
                            <p>For some reason we can't log you out. Try again later perhaps.</p>
                            <p>Contact us at <a href="mailto:support@kauntr.com">support@kauntr.com</a> if the issue persists.</p>
                        </div>
                    </Error>
                )
                : <LoadingIndicator isActive={this.props.isLoggingInOrOut} />
        );
    }
}

function mapStateToProps(state: AppState, ownProps: any): AuthenticationState {
    return state.authentication;
}

export default connect(mapStateToProps)(Logout);