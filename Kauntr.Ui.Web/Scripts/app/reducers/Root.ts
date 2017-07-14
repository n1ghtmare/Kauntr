import { combineReducers } from "redux";

import sharedContext from "./SharedContext";
import login from "./Login";
import authenticator from "./Authenticator";
import accountDetails from "./AccountDetails";

const rootReducer = combineReducers({
    sharedContext,
    login,
    authenticator,
    accountDetails
});

export default rootReducer;