import AuthenticatorState from "../interfaces/AuthenticationState";

import * as ActionTypes from "../constants/ActionTypes";

interface AuthenticatorAction {
    type: string;
    token?: number;
}

export const initialState: AuthenticatorState = {
    isLoggingInOrOut: false,
    isWaitingForEmailConfirmation: false,
    isRequestingAuthenticationToken: false
};

export default function authentication(state = initialState, action: AuthenticatorAction) {
    switch (action.type) {
        case ActionTypes.LOGIN:
            return {
                ...state,
                isLoggingInOrOut: true
            };
        case ActionTypes.LOGIN_SUCCESS:
            return {
                ...state,
                isLoggingInOrOut: false
            };
        case ActionTypes.LOGIN_FAILURE:
            return {
                ...state,
                isLoggingInOrOut: false
            };
        case ActionTypes.REQUEST_AUTHENTICATION_TOKEN:
            return {
                ...state,
                isRequestingAuthenticationToken: false,
                isWaitingForEmailConfirmation: false,
                token: action.token
            };
        case ActionTypes.REQUEST_AUTHENTICATION_TOKEN_SUCCESS:
            return {
                ...state,
                isRequestingAuthenticationToken: false,
                isWaitingForEmailConfirmation: true
            };
        case ActionTypes.REQUEST_AUTHENTICATION_TOKEN_FAILURE:
            return {
                ...state,
                isInvalidated: true,
                isLoadingData: false
            };
        case ActionTypes.LOGOUT:
            return {
                ...state,
                isLoggingInOrOut: true
            };
        case ActionTypes.LOGOUT_SUCCESS:
            return {
                ...state,
                isLoggingInOrOut: false
            };
        case ActionTypes.LOGOUT_FAILURE:
            return {
                ...state,
                isLoggingInOrOut: false
            };
        default:
            return state;
    }
}