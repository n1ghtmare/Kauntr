import * as React from "react";
import { connect } from "react-redux";

import AppState from "../interfaces/AppState";
import SharedContextState from "../interfaces/SharedContextState";

export class AuthorizationContainer extends React.Component<SharedContextState, any> {
    componentDidMount() {
        // BUG - when the user is in a component that requires authorization (and the user is already authorized) - refreshing the page causes him to be redirected to the login
        if (this.props.currentUserId === null) {
            this.props.router.push("/login?returnUrl=" + this.props.returnUrl);
        }
    }

    render() {
        if (this.props.currentUserId === null) {
            return null;
        }
        return (
            <div>{this.props.children}</div>
        );
    }
}

function mapStateToProps(state: AppState, ownProps: any): SharedContextState {
    return {
        ...state.sharedContext,
        returnUrl: ownProps.location.pathname
    };
};

export default connect(mapStateToProps)(AuthorizationContainer);