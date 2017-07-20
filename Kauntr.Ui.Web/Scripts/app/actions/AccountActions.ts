import * as moment from "moment";
import { hashHistory } from "react-router";

import AppState from "../interfaces/AppState";

import * as ActionTypes from "../constants/ActionTypes";

import { invalidateError, setError } from "./ErrorActions";

export function invalidatePersonalAccount() {
    return {
        type: ActionTypes.INVALIDATE_ACCOUNT_DETAILS
    };
}

export function fetchAccountDetailsIfNeeded(accountId?: number) {
    return (dispatch: Function, getState: Function): Promise<void> => {
        if (shouldFetchAccountDetails(getState())) {
            const token: number = moment().unix();
            const fetchUrl: string = `/account/index?token=${token}&accountId=${accountId}`;
            dispatch(loadAccountDetails(token));

            return fetch(fetchUrl)
                .then(response => {
                    if (!response.ok) {
                        throw response;
                    }
                    return response.json();
                })
                .then(json => {
                    if (shouldProcessAccountDetailsResponse(getState(), json.Token)) {
                        dispatch(loadAccountDetailsSuccess(json));
                    }
                })
                .catch((response: Response) => {
                    dispatch(loadAccountDetailsFailure());
                    dispatch(invalidateError());
                    dispatch(setError(response.status, response.statusText));

                    hashHistory.push("/error");
                });
        }
    };
}

function shouldProcessAccountDetailsResponse(state: AppState, token: number): boolean {
    return state.accountDetails.token === token;
}

function shouldFetchAccountDetails(state: AppState): boolean {
    const { isLoadingData, isInvalidated } = state.accountDetails;
    return !isLoadingData && isInvalidated;
}

function loadAccountDetails(token: number) {
    return {
        type: ActionTypes.LOAD_ACCOUNT_DETAILS,
        token
    };
}

function loadAccountDetailsSuccess(json: any) {
    return {
        type: ActionTypes.LOAD_ACCOUNT_DETAILS_SUCCESS,
        json
    };
}

function loadAccountDetailsFailure() {
    return {
        type: ActionTypes.LOAD_ACCOUNT_DETAILS_FAILURE
    };
}

export function updateAccountDisplayNameIfNeeded(displayName: string) {
    return (dispatch: Function, getState: Function): Promise<void> => {
        const fetchUrl: string = "/account/update";

        dispatch(updateAccountDisplayName());
        return fetch(fetchUrl, { method: "post", body: JSON.stringify({ displayName }), headers: { "Content-Type": "application/json" } })
            .then(response => {
                if (!response.ok) {
                    throw response;
                }
                return response;
            })
            .then(() => dispatch(updateAccountDisplayNameSuccess(displayName)))
            .catch((response: Response) => {
                dispatch(updateAccountDisplayNameFailure());
                dispatch(invalidateError());
                dispatch(setError(response.status, response.statusText, "Something bad happened and we couldn't update your display name, it is perhaps in a bad format"));

                hashHistory.push("/error");
            });
    };
}

function updateAccountDisplayName() {
    return {
        type: ActionTypes.UPDATE_ACCOUNT_DISPLAY_NAME
    };
}

function updateAccountDisplayNameSuccess(displayName: string) {
    return {
        type: ActionTypes.UPDATE_ACCOUNT_DISPLAY_NAME_SUCCESS,
        displayName
    };
}

function updateAccountDisplayNameFailure() {
    return {
        type: ActionTypes.UPDATE_ACCOUNT_DISPLAY_NAME_FAILURE
    };
}