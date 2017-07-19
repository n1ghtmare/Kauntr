import * as moment from "moment";

import AppState from "../interfaces/AppState";

import {
    LOGIN,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,

    REQUEST_AUTHENTICATION_TOKEN,
    REQUEST_AUTHENTICATION_TOKEN_SUCCESS,
    REQUEST_AUTHENTICATION_TOKEN_FAILURE,

    LOGOUT,
    LOGOUT_SUCCESS,
    LOGOUT_FAILURE
} from "../constants/ActionTypes";

export function loginUserAccount(accountId: number, authenticationToken: string, returnUrl: string, router: any) {
    return (dispatch: Function, getState: Function) => {
        const fetchUrl: string = "/account/authenticate";

        dispatch(login());
        return fetch(fetchUrl, { method: "post", body: JSON.stringify({ AccountId: accountId, AuthenticationToken: authenticationToken }), headers: { "Content-Type": "application/json" } })
            .then(response => {
                if (!response.ok) {
                    throw response.status.toString();
                }
                return response;
            })
            .then(() => {
                dispatch(loginSuccess());
                router.push(typeof returnUrl !== "undefined" ? returnUrl : "/");
            })
            .catch(errorMessage => dispatch(loginFailure(errorMessage)));
    };
}

function login() {
    return {
        type: LOGIN
    };
}

function loginSuccess() {
    return {
        type: LOGIN_SUCCESS
    };
}

function loginFailure(error: string) {
    return {
        type: LOGIN_FAILURE,
        error
    };
}

export function requestAuthenticationTokenIfNeeded(email: string, returnUrl: string) {
    return (dispatch: Function, getState: Function) => {
        if (shouldRequestAuthenticationToken(getState())) {
            const token: number = moment().unix();
            const fetchUrl: string = "/account/login";

            dispatch(requestAuthenticationToken(token));
            return fetch(fetchUrl, { method: "post", body: JSON.stringify({ Token: token, Email: email, ReturnUrl: returnUrl }), headers: { "Content-Type": "application/json" } })
                .then(response => {
                    if (!response.ok) {
                        throw Error(response.status.toString());
                    }
                    return response;
                })
                .then(() => dispatch(requestAuthenticationTokenSuccess()))
                .catch(errorStatusCode => dispatch(sendAuthenticationTokenFailure(`Error - status code - ${errorStatusCode}`)));
        }
    };
}

function shouldRequestAuthenticationToken(state: AppState): boolean {
    let { isRequestingAuthenticationToken } = state.authentication;
    return !isRequestingAuthenticationToken;
}

function requestAuthenticationToken(token: number) {
    return {
        type: REQUEST_AUTHENTICATION_TOKEN,
        token
    };
}

function requestAuthenticationTokenSuccess() {
    return {
        type: REQUEST_AUTHENTICATION_TOKEN_SUCCESS
    };
}

function sendAuthenticationTokenFailure(error: string) {
    return {
        type: REQUEST_AUTHENTICATION_TOKEN_FAILURE,
        error
    };
}

export function logoutUserAccount(router: any) {
    return (dispatch: Function, getState: Function) => {
        const fetchUrl: string = "/account/logout";

        dispatch(logout());
        return fetch(fetchUrl, { method: "post" })
            .then(response => {
                if (!response.ok) {
                    throw response.status.toString();
                }
                return response;
            })
            .then(() => {
                dispatch(logoutSuccess());
                router.push("/");
            })
            .catch(errorStatusCode => dispatch(logoutFailure(errorStatusCode)));

    }
}

function logout() {
    return {
        type: LOGOUT
    };
}

function logoutSuccess() {
    return {
        type: LOGOUT_SUCCESS
    };
}

function logoutFailure(error: string) {
    return {
        type: LOGOUT_FAILURE,
        error
    };
}