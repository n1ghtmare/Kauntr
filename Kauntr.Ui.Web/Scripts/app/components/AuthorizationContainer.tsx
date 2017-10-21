import * as React from "react";
import { connect } from "react-redux";

import AppState from "../interfaces/AppState";
import SharedContextState from "../interfaces/SharedContextState";

export class AuthorizationContainer extends React.Component<SharedContextState, any> {
    componentDidMount() {
        if (this.props.currentUserAccountId === null && !this.props.isLoadingData) {
            const { returnUrl } = this.props;
            this.props.router.push(returnUrl === "/logout" ? "/" : "/login?returnUrl=" + returnUrl);
        }
    }

    render() {
        if (this.props.currentUserAccountId === null) {
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
}

export default connect(mapStateToProps, null)(AuthorizationContainer);