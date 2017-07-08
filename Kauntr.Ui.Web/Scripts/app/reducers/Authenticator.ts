import AuthenticatorState from "../interfaces/AuthenticatorState";

import {
    AUTHENTICATE,
    AUTHENTICATE_SUCCESS,
    AUTHENTICATE_FAILURE
} from "../constants/ActionTypes";

interface AuthenticatorAction {
    type: string;
    error?: string;
}

export const initialState: AuthenticatorState = {
    isLoadingData: false,
    error: null
};

export default function authenticator(state = initialState, action: AuthenticatorAction) {
    switch (action.type) {
        case AUTHENTICATE:
            return {
                ...state,
                isLoadingData: true,
                error: null
            };
        case AUTHENTICATE_SUCCESS:
            return {
                ...state,
                isLoadingData: false
            };
        case AUTHENTICATE_FAILURE:
            return {
                ...state,
                isLoadingData: false,
                error: action.error
            };
        default:
            return state;
    }
}