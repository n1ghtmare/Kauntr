import { combineReducers } from "redux";

import account from "./Account";


const rootReducer = combineReducers({
    account
    // TODO - add/combine rest of reducers
});

export default rootReducer;