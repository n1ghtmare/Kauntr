import * as React from "react";
import * as ReactDOM from "react-dom";
import { Router, Route, Redirect, hashHistory } from "react-router";

import { createStore, applyMiddleware } from "redux";

import thunkMiddleware from "redux-thunk";
import createLogger from "redux-logger";
import { Provider } from "react-redux";

import rootReducer from "../reducers/Root";

import App from "../components/App";
import CountdownList from "../components/CountdownList";
import CountdownDetails from "../components/CountdownDetails";
import CountdownForm from "../components/CountdownForm";
import Login from "../components/Login";
import Account from "../components/Account";
import AccountDetails from "../components/AccountDetails";
import NotificationList from "../components/NotificationList";
import Authenticator from "../components/Authenticator";
import AuthorizationContainer from "../components/AuthorizationContainer";

// Redux Setup
const createStoreWithMiddleware = applyMiddleware(
    thunkMiddleware,
    createLogger
)(createStore);
const store = createStoreWithMiddleware(rootReducer);

const routes = (
    <Provider store={store}>
        <Router history={hashHistory}>
            <Route component={App}>
                <Route component={AuthorizationContainer}>
                    <Route component={CountdownList} path="/countdowns/mine" />
                    <Route component={CountdownForm} path="/countdown/create" />
                    <Route component={Account} path="/account" />
                    <Route component={NotificationList} path="/notifications" />
                </Route>
                <Redirect from="/" to="countdowns/trending" />
                <Route component={CountdownList} path="/countdowns/:category" />
                <Route component={CountdownDetails} path="/countdown/:id" />
                <Route component={Login} path="/login" />
                <Route component={AccountDetails} path="/account/:id" />
            </Route>
            <Route component={Authenticator} path="/authenticate/account/:accountId/token/:authenticationToken" />
        </Router>
    </Provider>
);

ReactDOM.render(routes, document.getElementById("app-container"));
