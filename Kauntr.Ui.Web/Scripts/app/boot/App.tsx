import * as React from "react";
import * as ReactDOM from "react-dom";
import { HashRouter, Route, Redirect } from "react-router-dom";

import Countdown from "../components/Countdown";
import Login from "../components/Login";

const RouterLayout = () => (
    <div>
        <div>This is going to be the menu</div>
        <div>
            <Route component={Countdown} path="/countdown" />
            <Route component={Login} path="/login" />
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
