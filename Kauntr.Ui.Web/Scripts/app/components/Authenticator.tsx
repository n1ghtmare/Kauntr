import * as React from "react";
import { connect } from "react-redux";

import { authenticateUser } from "../actions/AuthenticatorActions";

import AppState from "../interfaces/AppState";
import AuthenticatorState from "../interfaces/AuthenticatorState";

import LoadingIndicator from "./LoadingIndicator";
import Error from "./Error";

export class Authenticator extends React.Component<AuthenticatorState, any> {
    componentDidMount() {
        const { dispatch, router } = this.props;
        const { accountId, authenticationToken } = router.params;

        dispatch(authenticateUser(accountId, authenticationToken, router.location.query.returnUrl, router));
    }

    render() {
        return (
            this.props.error !== null
                ? (
                    <Error code={this.props.error} subMessage={"Ooops, something went wrong."}>
                        <div className="text-error">
                            <p>Your authentication token is either invalid, it has been used already (they're one time use only), or it has expired and is no longer valid.</p>
                            <p>Or, you know ... something else entirely.</p>
                            <p>Contact us at <a href="mailto:support@kauntr.com">support@kauntr.com</a> if the issue persists.</p>
                        </div>
                    </Error>
                )
                : <LoadingIndicator isActive={this.props.isLoadingData} />
        );
    }
}

function mapStateToProps(state: AppState, ownProps: any): AuthenticatorState {
    return state.authenticator;
}

export default connect(mapStateToProps)(Authenticator);