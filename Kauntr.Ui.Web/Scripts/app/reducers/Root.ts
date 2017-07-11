import { combineReducers } from "redux";

import sharedContext from "./SharedContext";
import login from "./Login";
import authenticator from "./Authenticator";
import personalAccount from "./PersonalAccount";

const rootReducer = combineReducers({
    sharedContext,
    login,
    authenticator,
    personalAccount
});

export default rootReducer;