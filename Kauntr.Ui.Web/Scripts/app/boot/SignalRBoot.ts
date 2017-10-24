import { Store } from "redux";

import AppState from "../interfaces/AppState";

import {
    updateCountdownAfterVote
} from "../actions/LiveActions";

export default function startSignalRHub(store: Store<any>) {
    const connection: SignalR = $.connection;
    const hubProxy: SignalR.Hub.Proxy = connection.hub.createHubProxy("notificationHub");

    hubProxy.on("broadcastCountdownUpdate", (countdown: any, triggeredByUserAccountId: number) => {
        if (shouldUpdateCountdown(store.getState(), triggeredByUserAccountId)) {
            store.dispatch(updateCountdownAfterVote(countdown));
        }
    });

    connection.hub.start();
}

function shouldUpdateCountdown(state: AppState, triggeredByUserAccountId: number) {
    const { sharedContext } = state;
    // TODO - Uncomment after debug (decide if the countdown should always be updated allowing a user to have multi-tabs open and have them synchronized)
    // return sharedContext.currentUserAccountId === null || sharedContext.currentUserAccountId !== triggeredByUserAccountId;
    return true;
}