import * as moment from "moment";

import AppState from "../interfaces/AppState";

import {
    AUTHENTICATE,
    AUTHENTICATE_SUCCESS,
    AUTHENTICATE_FAILURE,

    INVALIDATE_SEND_AUTHENTICATION_TOKEN,
    SEND_AUTHENTICATION_TOKEN,
    SEND_AUTHENTICATION_TOKEN_SUCCESS,
    SEND_AUTHENTICATION_TOKEN_FAILURE
} from "../constants/ActionTypes";

export function authenticateUser(accountId: number, authenticationToken: string, returnUrl: string, router: any) {
    return (dispatch: Function, getState: Function) => {
        const fetchUrl: string = "/account/authenticate";

        dispatch(authenticate());
        return fetch(fetchUrl, { method: "post", body: JSON.stringify({ AccountId: accountId, AuthenticationToken: authenticationToken }), headers: { "Content-Type": "application/json" } })
            .then(response => {
                if (!response.ok) {
                    throw response.status.toString();
                }
                return response;
            })
            .then(() => {
                dispatch(authenticateSuccess());
                router.push(typeof returnUrl !== "undefined" ? returnUrl : "/");
            })
            .catch(errorMessage => dispatch(authenticateFailure(errorMessage)));
    };
}

function authenticate() {
    return {
        type: AUTHENTICATE
    };
}

function authenticateSuccess() {
    return {
        type: AUTHENTICATE_SUCCESS
    };
}

function authenticateFailure(error: string) {
    return {
        type: AUTHENTICATE_FAILURE,
        error
    };
}

export function invalidateSendAuthenticationToken() {
    return {
        type: INVALIDATE_SEND_AUTHENTICATION_TOKEN
    };
}

export function sendAuthenticationTokenIfNeeded(email: string, returnUrl: string) {
    return (dispatch: Function, getState: Function) => {
        if (shouldRequestAuthenticationToken(getState())) {
            const token: number = moment().unix();
            const fetchUrl: string = "/account/login";

            dispatch(sendAuthenticationToken(token));
            return fetch(fetchUrl, { method: "post", body: JSON.stringify({ Token: token, Email: email, ReturnUrl: returnUrl }), headers: { "Content-Type": "application/json" } })
                .then(response => {
                    if (!response.ok) {
                        throw Error(response.status.toString());
                    }
                    return response;
                })
                .then(() => dispatch(sendAuthenticationTokenSuccess()))
                .catch(errorStatusCode => {
                    dispatch(sendAuthenticationTokenFailure(`Error - status code - ${errorStatusCode}`));
                });
        }
    };
}

function shouldRequestAuthenticationToken(state: AppState): boolean {
    let { isLoadingData, isInvalidated } = state.login;
    return !isLoadingData && isInvalidated;
}

function sendAuthenticationToken(token: number) {
    return {
        type: SEND_AUTHENTICATION_TOKEN,
        token
    };
}

function sendAuthenticationTokenSuccess() {
    return {
        type: SEND_AUTHENTICATION_TOKEN_SUCCESS
    };
}

function sendAuthenticationTokenFailure(error: string) {
    return {
        type: SEND_AUTHENTICATION_TOKEN_FAILURE,
        error
    };
}