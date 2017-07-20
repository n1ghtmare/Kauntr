import { combineReducers } from "redux";

import sharedContext from "./SharedContext";
import authentication from "./Authentication";
import accountDetails from "./AccountDetails";
import error from "./Error";

const rootReducer = combineReducers({
    sharedContext,
    authentication,
    accountDetails,
    error
});

export default rootReducer;