import * as React from "react";
import { connect } from "react-redux";

import {
    invalidateSharedContext,
    fetchSharedContextIfNeeded
} from "../actions/SharedContextActions";

import AppState from "../interfaces/AppState";
import SharedContextState from "../interfaces/SharedContextState";

import Header from "./Header";
import LoadingIndicator from "./LoadingIndicator";

export class App extends React.Component<SharedContextState, any> {
    componentWillMount() {
        let { dispatch } = this.props;
        dispatch(invalidateSharedContext());
        dispatch(fetchSharedContextIfNeeded());
    }

    renderContent(): any {
        if (this.props.isLoadingData) {
            return null;
        }
        return (
            <div className="animated fadeIn">
                <Header />
                <div className="container main-content">
                    {this.props.children}
                </div>
            </div>
        );
    }

    render() {
        return (
            <div>
                <LoadingIndicator isActive={this.props.isLoadingData} />
                {this.renderContent()}
            </div>
        );
    }
}

export default connect((state: AppState): any => {
    return state.sharedContext;
})(App);

