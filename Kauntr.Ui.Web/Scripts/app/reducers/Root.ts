import { combineReducers } from "redux";

import sharedContext from "./SharedContext";
import authentication from "./Authentication";
import accountDetails from "./AccountDetails";

const rootReducer = combineReducers({
    sharedContext,
    authentication,
    accountDetails
});

export default rootReducer;