import * as React from "react";
import { connect } from "react-redux";

import { logoutUserAccount } from "../actions/AuthenticationActions";

import AppState from "../interfaces/AppState";
import AuthenticationState from "../interfaces/AuthenticationState";

import LoadingIndicator from "./LoadingIndicator";

export class Logout extends React.Component<AuthenticationState, any> {
    componentDidMount() {
        const { dispatch, router } = this.props;

        dispatch(logoutUserAccount(router));
    }

    render() {
        return (
            <LoadingIndicator isActive={this.props.isLoggingInOrOut} />
        );
    }
}

function mapStateToProps(state: AppState, ownProps: any): AuthenticationState {
    return state.authentication;
}

export default connect(mapStateToProps, null)(Logout);