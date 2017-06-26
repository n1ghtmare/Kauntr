import * as React from "react";
import * as ReactDOM from "react-dom";
import { HashRouter, Route, Redirect } from "react-router-dom";

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

// Redux Setup
const createStoreWithMiddleware = applyMiddleware(
    thunkMiddleware,
    createLogger
)(createStore);
const store = createStoreWithMiddleware(rootReducer);

// TODO - Hookup to redux and test with the state passed from the store -> isAuthenticated? (use for routes that need to be private)
class PrivateRoute extends React.Component<any, any> {
    render() {
        return (
            <Route {...this.props} render={props => (
                this.props.isAuthenticated
                    ? <this.props.component {...props} />
                    : <Redirect to={{ pathname: "/login", state: { from: props.location } }} />
            )} />
        );
    }
}

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
