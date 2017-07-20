import * as moment from "moment";
import { hashHistory } from "react-router";

import AppState from "../interfaces/AppState";

import * as ActionTypes from "../constants/ActionTypes";

import { handleServerError } from "./ErrorActions";

export function loginUserAccount(accountId: number, authenticationToken: string, returnUrl: string) {
    return (dispatch: Function, getState: Function) => {
        const fetchUrl: string = "/account/authenticate";

        dispatch(login());
        return fetch(fetchUrl, { method: "post", body: JSON.stringify({ AccountId: accountId, AuthenticationToken: authenticationToken }), headers: { "Content-Type": "application/json" } })
            .then(response => {
                if (!response.ok) {
                    throw response;
                }
                return response;
            })
            .then(() => {
                dispatch(loginSuccess());
                hashHistory.push(typeof returnUrl !== "undefined" ? returnUrl : "/");
            })
            .catch((response: Response) => handleServerError(response, dispatch, loginFailure, "Your authentication token is either invalid, it has been used already (they're one time use only), or it has expired and is no longer valid. Or, you know ... something else entirely."));
    };
}

function login() {
    return {
        type: ActionTypes.LOGIN
    };
}

function loginSuccess() {
    return {
        type: ActionTypes.LOGIN_SUCCESS
    };
}

function loginFailure() {
    return {
        type: ActionTypes.LOGIN_FAILURE
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
                .catch((response: Response) => handleServerError(response, dispatch, sendAuthenticationTokenFailure, "Hmmm, something went wrong. Either the email is invalid, or you have too many login attempts."));
        }
    };
}

function shouldRequestAuthenticationToken(state: AppState): boolean {
    let { isRequestingAuthenticationToken } = state.authentication;
    return !isRequestingAuthenticationToken;
}

function requestAuthenticationToken(token: number) {
    return {
        type: ActionTypes.REQUEST_AUTHENTICATION_TOKEN,
        token
    };
}

function requestAuthenticationTokenSuccess() {
    return {
        type: ActionTypes.REQUEST_AUTHENTICATION_TOKEN_SUCCESS
    };
}

function sendAuthenticationTokenFailure() {
    return {
        type: ActionTypes.REQUEST_AUTHENTICATION_TOKEN_FAILURE
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
            .catch((response: Response) => handleServerError(response, dispatch, logoutFailure, "For some reason we can't log you out. Try again later perhaps."));

    }
}

function logout() {
    return {
        type: ActionTypes.LOGOUT
    };
}

function logoutSuccess() {
    return {
        type: ActionTypes.LOGOUT_SUCCESS
    };
}

function logoutFailure() {
    return {
        type: ActionTypes.LOGOUT_FAILURE
    };
}