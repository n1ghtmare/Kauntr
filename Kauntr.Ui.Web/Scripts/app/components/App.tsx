import * as React from "react";
import { connect, Provider } from "react-redux";

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

    componentDidUpdate(prevProps: SharedContextState) {
        const isLoggingOut = prevProps.currentUserAccountId !== null && this.props.currentUserAccountId === null;
        const isLoggingIn = prevProps.currentUserAccountId === null && this.props.currentUserAccountId !== null;

        if (isLoggingIn) {
            // navigate to returnUrl and clear returnUrl in store
        } else if (isLoggingOut) {
            // do any kind of cleanup or post-logout redirection here
        }
    }

    renderContent(): any {
        if (this.props.isLoadingData) {
            return null;
        }
        return (
            <div>
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

