import { combineReducers } from "redux";

import sharedContext from "./SharedContext";
import login from "./Login";

const rootReducer = combineReducers({
    sharedContext,
    login
});

export default rootReducer;