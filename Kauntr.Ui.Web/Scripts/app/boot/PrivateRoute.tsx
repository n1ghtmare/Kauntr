import * as React from "react";
import { Route, Redirect } from "react-router";
import { connect } from "react-redux";

import AppState from "../interfaces/AppState";

export const PrivateRoute = ({ component: Component, isAuthenticated, ...rest }: any) => {
    return (
        <Route {...rest} render={props => (
            isAuthenticated
                ? <Component {...props} />
                : <Redirect to={{ pathname: "/login", state: { from: props.location } }} />
            )}
        />
    );
};

const mapStateToProps = (state: AppState, ownProps: any) => {
    return {
        isAuthenticated: state.sharedContext.currentUserId !== null,
        ...ownProps
    };
};

export default connect(mapStateToProps, null)(PrivateRoute);