import * as React from "react";
import { connect } from "react-redux";

import AppState from "../interfaces/AppState";
import SharedContextState from "../interfaces/SharedContextState";

export class AuthorizationContainer extends React.Component<SharedContextState, any> {
    componentDidMount() {
        const { dispatch } = this.props;

        if(this.props.currentUserId === null) {
            // dispatch(setReturnUrl(this.props.returnUrl));
            console.log(this.props.router.push("/login"));
        }
    }

    render() {
        if(this.props.currentUserId === null) {
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

export default connect(mapStateToProps)(AuthorizationContainer)