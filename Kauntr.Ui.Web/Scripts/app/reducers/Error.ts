import ErrorState from "../interfaces/ErrorState";

import * as ActionTypes from "../constants/ActionTypes";

interface ErrorAction {
    type: string;
    code?: number;
    error?: string;
    subError?: string;
}

export const initialState: ErrorState = {
    code: null,
    error: null,
    subError: null
};

export default function error(state = initialState, action: ErrorAction): ErrorState {
    switch (action.type) {
        case ActionTypes.INVALIDATE_ERROR:
            return null;
        case ActionTypes.SET_ERROR:
            return {
                code: action.code,
                error: action.error,
                subError: action.subError
            };
        default:
            return state;
    }
}