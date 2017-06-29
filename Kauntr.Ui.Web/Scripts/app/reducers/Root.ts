import { combineReducers } from "redux";

import sharedContext from "./SharedContext";

const rootReducer = combineReducers({
    sharedContext
    // TODO - add/combine rest of reducers
});

export default rootReducer;