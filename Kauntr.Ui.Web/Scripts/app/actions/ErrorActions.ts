import { hashHistory } from "react-router";

import * as ActionTypes from "../constants/ActionTypes";

function setError(code: number, error: string, subError: string = null) {
    return {
        type: ActionTypes.SET_ERROR,
        code,
        error,
        subError
    };
}

function invalidateError() {
    return {
        type: ActionTypes.INVALIDATE_ERROR
    };
}


export function handleServerError(response: Response, dispatch: Function, failureAction: Function, customErrorMessage: string = null) {
    dispatch(failureAction());
    dispatch(invalidateError());
    dispatch(setError(response.status, response.statusText, customErrorMessage));

    hashHistory.push("/error");
}