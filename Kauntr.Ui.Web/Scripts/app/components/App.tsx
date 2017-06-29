import * as React from "react";
import { connect } from "react-redux";
import * as classNames from "classnames";

import {
    invalidateSharedContext,
    fetchSharedContextIfNeeded
} from "../actions/SharedContextActions";

import AppState from "../interfaces/AppState";
import SharedContextState from "../interfaces/SharedContextState";

import Header from "./Header";

export class App extends React.Component<SharedContextState, any> {
    componentWillMount() {
        let { dispatch } = this.props;
        dispatch(invalidateSharedContext());
        dispatch(fetchSharedContextIfNeeded());
    }

    renderContent() {
        if (this.props.isLoadingData) {
            return null;
        }
        return (
            <div className="animated fadeIn">
                <Header />
                <div id="container" className="container">
                    {this.props.children}
                </div>
            </div>
        );
    }

    render() {
        return (
            <div>
                <div className={classNames({ "hidden": !this.props.isLoadingData })}>
                    Loading data, please wait ...
                </div>
                {this.renderContent()}
            </div>
        );
    }
}

export default connect((state: AppState): any => {
    return state.sharedContext;
})(App);

