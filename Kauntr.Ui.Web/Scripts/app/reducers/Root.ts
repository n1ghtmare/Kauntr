import { combineReducers } from "redux";

import sharedContext from "./SharedContext";
import login from "./Login";
import authenticator from "./Authenticator";

const rootReducer = combineReducers({
    sharedContext,
    login,
    authenticator
});

export default rootReducer;