import * as React from "react";
import * as ReactDOM from "react-dom";
import { hashHistory } from "react-router";
import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import createLogger from "redux-logger";
import { AppContainer } from "react-hot-loader";

import rootReducer from "../reducers/Root";

import Root from "./Root";

const createStoreWithMiddleware = applyMiddleware(
    thunkMiddleware,
    createLogger
)(createStore);
const store = createStoreWithMiddleware(rootReducer);

const container: HTMLElement = document.getElementById("app-container");

ReactDOM.render(
    <AppContainer>
        <Root store={store} history={hashHistory} />
    </AppContainer>,
    container
);

if (module.hot) {
    module.hot.accept("./Root", () => {
        const NextApp = require<{ default: typeof Root }>("./Root").default;
        ReactDOM.render(
            <AppContainer>
                <Root store={store} history={hashHistory} />
            </AppContainer>,
            container
        );
    });
}