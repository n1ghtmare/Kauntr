import * as React from "react";
import * as ReactDOM from "react-dom";
import { HashRouter, Route, Redirect } from "react-router-dom";

import CountdownList from "../components/CountdownList";
import CountdownDetails from "../components/CountdownDetails";
import CountdownForm from "../components/CountdownForm";
import Login from "../components/Login";
import Account from "../components/Account";
import AccountDetails from "../components/AccountDetails";
import NotificationList from "../components/NotificationList";

const RouterLayout = () => (
    <div>
        <div>This is going to be the menu</div>
        <div>
            <Route component={CountdownList} path="/countdowns/:category" />
            <Route component={CountdownDetails} path="/countdown/:id" />
            <Route component={CountdownForm} path="/countdown/create" />
            <Route component={Login} path="/login" />
            <Route component={Account} path="/account" />
            <Route component={AccountDetails} path="/account/:id" />
            <Route component={NotificationList} path="/notifications" />
            <Redirect from="/" to="countdown" />
        </div>
    </div>
);

const routes = (
    <HashRouter>
        <RouterLayout />
    </HashRouter>
);

ReactDOM.render(routes, document.getElementById("app-container"));
