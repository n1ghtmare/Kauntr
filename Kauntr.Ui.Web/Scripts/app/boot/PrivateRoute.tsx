import * as React from "react";
import {Route, Redirect} from "react-router";
import { connect } from "react-redux";

import AppState from "../interfaces/AppState";

interface ExtendedAppState extends AppState {
    component: React.ComponentClass;
    location: Location;
};

export class PrivateRoute extends React.Component<ExtendedAppState, any> {
    render() {
        return (
            <this.props.component {...this.props} />
            // <Route {...this.props} render={props => (
            //     this.props.sharedContext.currentUserId !== null
            //         ? <this.props.component {...this.props} />
            //         : <Redirect to={{ pathname: "/login", state: { from: this.props.location } }} />
            // )} />
        );
    }
}

export default connect((state: AppState): any => {
    return state.sharedContext;
})(PrivateRoute);
