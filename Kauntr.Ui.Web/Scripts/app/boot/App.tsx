import * as React from "react";
import * as ReactDOM from "react-dom";
import { HashRouter, Route, Redirect, Switch } from "react-router-dom";

import { createStore, applyMiddleware } from "redux";

import thunkMiddleware from "redux-thunk";
import createLogger from "redux-logger";
import { Provider } from "react-redux";

import rootReducer from "../reducers/Root";

import { PrivateRoute } from "./PrivateRoute";

import App from "../components/App";
import CountdownList from "../components/CountdownList";
import CountdownDetails from "../components/CountdownDetails";
import CountdownForm from "../components/CountdownForm";
import Login from "../components/Login";
import Account from "../components/Account";
import AccountDetails from "../components/AccountDetails";
import NotificationList from "../components/NotificationList";

// Redux Setup
const createStoreWithMiddleware = applyMiddleware(
    thunkMiddleware,
    createLogger
)(createStore);
const store = createStoreWithMiddleware(rootReducer);

const RouterLayout = () => (
    <Provider store={store}>
        <App>
            <Switch>
                <Route component={CountdownList} path="/countdowns/:category" />
                <Route component={CountdownDetails} path="/countdown/:id" />
                <PrivateRoute component={CountdownForm} path="/countdown/create" />
                <Route component={Login} path="/login" />
                <PrivateRoute component={Account} path="/account" />
                <Route component={AccountDetails} path="/account/:id" />
                <PrivateRoute component={NotificationList} path="/notifications" />
                <Redirect from="/" to="countdown" />
            </Switch>
        </App>
    </Provider>
);

const routes = (
    <HashRouter>
        <RouterLayout />
    </HashRouter>
);

ReactDOM.render(routes, document.getElementById("app-container"));
