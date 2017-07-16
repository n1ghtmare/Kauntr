import AuthenticatorState from "../interfaces/AuthenticationState";

import {
    LOGIN,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,

    REQUEST_AUTHENTICATION_TOKEN,
    REQUEST_AUTHENTICATION_TOKEN_SUCCESS,
    REQUEST_AUTHENTICATION_TOKEN_FAILURE
} from "../constants/ActionTypes";

interface AuthenticatorAction {
    type: string;
    error?: string;
    token?: number;
}

export const initialState: AuthenticatorState = {
    isLoggingInOrOut: false,
    isWaitingForEmailConfirmation: false,
    isRequestingAuthenticationToken: false,
    error: null
};

export default function authentication(state = initialState, action: AuthenticatorAction) {
    switch (action.type) {
        case LOGIN:
            return {
                ...state,
                isLoggingInOrOut: true,
                error: null
            };
        case LOGIN_SUCCESS:
            return {
                ...state,
                isLoggingInOrOut: false
            };
        case LOGIN_FAILURE:
            return {
                ...state,
                isLoggingInOrOut: false,
                error: action.error
            };
        case REQUEST_AUTHENTICATION_TOKEN:
            return {
                ...state,
                isRequestingAuthenticationToken: false,
                isWaitingForEmailConfirmation: false,
                token: action.token
            };
        case REQUEST_AUTHENTICATION_TOKEN_SUCCESS:
            return {
                ...state,
                isRequestingAuthenticationToken: false,
                isWaitingForEmailConfirmation: true
            };
        case REQUEST_AUTHENTICATION_TOKEN_FAILURE:
            return {
                ...state,
                isInvalidated: true,
                isLoadingData: false,
                error: action.error
            };
        default:
            return state;
    }
}