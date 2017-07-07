import LoginState from "../interfaces/LoginState";

import {
    INVALIDATE_SEND_AUTHENTICATION_TOKEN,
    SEND_AUTHENTICATION_TOKEN,
    SEND_AUTHENTICATION_TOKEN_SUCCESS,
    SEND_AUTHENTICATION_TOKEN_FAILURE
} from "../constants/ActionTypes";

interface LoginAction {
    type: string;
    token?: number;
    error?: string;
}

export const initialState: LoginState = {
    isLoadingData: false,
    isInvalidated: true,
    isWaitingForEmailConfirmation: false,
    error: null
};

export default function login(state = initialState, action: LoginAction) {
    switch (action.type) {
        case INVALIDATE_SEND_AUTHENTICATION_TOKEN:
            return {
                ...state,
                isInvalidated: true,
                error: null
            };
        case SEND_AUTHENTICATION_TOKEN:
            return {
                ...state,
                isInvalidated: false,
                isLoadingData: true,
                token: action.token
            };
        case SEND_AUTHENTICATION_TOKEN_SUCCESS:
            return {
                ...state,
                isInvalidated: true,
                isLoadingData: false,
                isWaitingForEmailConfirmation: true
            };
        case SEND_AUTHENTICATION_TOKEN_FAILURE:
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