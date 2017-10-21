import * as React from "react";
import { Router, Route, Redirect, HistoryBase } from "react-router";
import { Provider, Store } from "react-redux";

import App from "../components/App";
import CountdownList from "../components/CountdownList";
import CountdownDetails from "../components/CountdownDetails";
import CountdownCreate from "../components/CountdownCreate";
import Login from "../components/Login";
import AccountDetails from "../components/AccountDetails";
import NotificationList from "../components/NotificationList";
import Authenticator from "../components/Authenticator";
import AuthorizationContainer from "../components/AuthorizationContainer";
import Logout from "../components/Logout";
import ErrorContainer from "../components/ErrorContainer";
import ErrorNotFound from "../components/ErrorNotFound";

interface RootProps {
    store: Store<any>;
    history: HistoryBase;
}

export default class Root extends React.Component<RootProps, any> {
    private routes: JSX.Element[] = [
        <Route component={App} key={"app-root"}>
            <Route component={AuthorizationContainer}>
                <Route component={CountdownList} path="/countdowns/mine" />
                <Route component={CountdownCreate} path="/countdown/create" />
                <Route component={AccountDetails} path="/account" />
                <Route component={NotificationList} path="/notifications" />
            </Route>
            <Redirect from="/" to="countdowns" />
            <Route component={CountdownList} path="/countdowns" />
            <Route component={CountdownList} path="/countdowns/:category" />
            <Route component={CountdownDetails} path="/countdown/:id" />
            <Route component={Login} path="/login" />
            <Route component={AccountDetails} path="/account/:id" />
        </Route>,
        <Route component={Authenticator} path="/authenticate/account/:accountId/token/:authenticationToken" key={"authenticator"} />,
        <Route component={AuthorizationContainer} key={"authorization-container"}>
            <Route component={Logout} path="/logout" />
        </Route>,
        <Route component={ErrorContainer} path="error" key={"error-generic"} />,
        <Route component={ErrorNotFound} path="*" key={"error-404"} />
    ];

    render() {
        return (
            <Provider store={this.props.store}>
                <Router history={this.props.history}>
                    {this.routes}
                </Router>
            </Provider>
        );
    }
}