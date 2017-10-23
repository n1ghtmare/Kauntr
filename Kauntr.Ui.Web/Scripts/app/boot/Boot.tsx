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
        const NextRoot = require<{ default: typeof Root }>("./Root").default;
        ReactDOM.render(
            <AppContainer>
                <NextRoot store={store} history={hashHistory} />
            </AppContainer>,
            container
        );
    });
}

$(() => {
    // Example - SignalR boot setup
    const connection: SignalR = $.connection;
    const hubProxy: SignalR.Hub.Proxy = connection.hub.createHubProxy("notificationHub");

    hubProxy.on("broadcastCountdownUpdate", (countdown: any, triggeredByUserAccountId: number) => {
        // TODO - Trigger an action creator to update the store accordingly
        console.log(countdown);
        console.log(triggeredByUserAccountId);
    });

    hubProxy.on("broadcastCommentUpdate", (comment: any, triggeredByUserAccountId: number) => {
        // TODO - Trigger an action creator to update the store accordingly
        console.log(comment);
        console.log(triggeredByUserAccountId);
    });

    connection.hub.start();
});