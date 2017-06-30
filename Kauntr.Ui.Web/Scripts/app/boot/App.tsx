import * as React from "react";
import * as ReactDOM from "react-dom";
import { HashRouter, Route, Redirect } from "react-router-dom";

import { createStore, applyMiddleware } from "redux";

import thunkMiddleware from "redux-thunk";
import createLogger from "redux-logger";
import { Provider } from "react-redux";

import rootReducer from "../reducers/Root";

// TODO - Hookup the PrivateRoute
import PrivateRoute from "./PrivateRoute";

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
            <Route component={CountdownList} path="/countdowns/:category" />
            <Route component={CountdownDetails} path="/countdown/:id" />
            <Route component={CountdownForm} path="/countdown/create" />
            <Route component={Login} path="/login" />
            <Route component={Account} path="/account" />
            <Route component={AccountDetails} path="/account/:id" />
            <Route component={NotificationList} path="/notifications" />
            <Redirect from="/" to="countdown" />
        </App>
    </Provider>
);

const routes = (
    <HashRouter>
        <RouterLayout />
    </HashRouter>
);

ReactDOM.render(routes, document.getElementById("app-container"));
