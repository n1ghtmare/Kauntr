import * as ActionTypes from "../constants/ActionTypes";

export function setError(code: number, error: string, subError: string = null) {
    return {
        type: ActionTypes.SET_ERROR,
        code,
        error,
        subError
    };
}

export function invalidateError() {
    return {
        type: ActionTypes.INVALIDATE_ERROR
    };
}