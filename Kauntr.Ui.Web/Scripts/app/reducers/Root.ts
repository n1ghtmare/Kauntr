import { combineReducers } from "redux";

import sharedContext from "./SharedContext";
import authentication from "./Authentication";
import account from "./Account";
import countdown from "./Countdown";
import countdownList from "./CountdownList";
import notificationList from "./NotificationList";
import error from "./Error";

const rootReducer = combineReducers({
    sharedContext,
    authentication,
    account,
    countdown,
    countdownList,
    notificationList,
    error
});

export default rootReducer;