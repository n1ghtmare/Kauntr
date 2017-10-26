import { Store } from "redux";

import AppState from "../interfaces/AppState";

import {
    updateCountdownAfterVote,
    updateCommentAfterVote,
    updateCountdownListAfterCreate,
    updateCommentListAfterCreate
} from "../actions/LiveActions";

export default function startSignalRHub(store: Store<any>) {
    const connection: SignalR = $.connection;
    const hubProxy: SignalR.Hub.Proxy = connection.hub.createHubProxy("notificationHub");

    hubProxy.on("broadcastCountdownUpdate", (countdown: any) => store.dispatch(updateCountdownAfterVote(countdown)));

    hubProxy.on("broadcastCommentUpdate", (comment: any) => store.dispatch(updateCommentAfterVote(comment)));

    hubProxy.on("broadcastCountdownCreate", (countdown: any) => store.dispatch(updateCountdownListAfterCreate(countdown)));

    hubProxy.on("broadcastCommentCreate", (comment: any) => store.dispatch(updateCommentListAfterCreate(comment)));

    connection.hub.start();
}
