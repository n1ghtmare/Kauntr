import * as moment from "moment";

import AppState from "../interfaces/AppState";

import {
    INVALIDATE_SEND_AUTHENTICATION_TOKEN,
    SEND_AUTHENTICATION_TOKEN,
    SEND_AUTHENTICATION_TOKEN_SUCCESS,
    SEND_AUTHENTICATION_TOKEN_FAILURE
} from "../constants/ActionTypes";

export function invalidateSendAuthenticationToken() {
    return {
        type: INVALIDATE_SEND_AUTHENTICATION_TOKEN
    };
}

export function sendAuthenticationTokenIfNeeded(email: string, returnUrl: string) {
    return (dispatch: Function, getState: Function): Promise<void> => {
        if (shouldRequestAuthenticationToken(getState())) {
            const token: number = moment().unix();
            const fetchUrl: string = "/account/login";

            dispatch(sendAuthenticationToken(token));

            return fetch(fetchUrl, { method: "post", body: { Token: token, Email: email, ReturnUrl: returnUrl } })
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