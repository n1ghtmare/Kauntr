import * as moment from "moment";

import AppState from "../interfaces/AppState";

import {
    INVALIDATE_ACCOUNT_DETAILS,
    LOAD_ACCOUNT_DETAILS,
    LOAD_ACCOUNT_DETAILS_SUCCESS,
    LOAD_ACCOUNT_DETAILS_FAILURE,
    UPDATE_ACCOUNT_DISPLAY_NAME,
    UPDATE_ACCOUNT_DISPLAY_NAME_SUCCESS,
    UPDATE_ACCOUNT_DISPLAY_NAME_FAILURE
} from "../constants/ActionTypes";

export function invalidatePersonalAccount() {
    return {
        type: INVALIDATE_ACCOUNT_DETAILS
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
                        throw response.status.toString();
                    }
                    return response.json();
                })
                .then(json => {
                    if (shouldProcessAccountDetailsResponse(getState(), json.Token)) {
                        dispatch(loadAccountDetailsSuccess(json));
                    }
                })
                .catch(errorMessage => dispatch(loadAccountDetailsFailure(errorMessage)));
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
        type: LOAD_ACCOUNT_DETAILS,
        token
    };
}

function loadAccountDetailsSuccess(json: any) {
    return {
        type: LOAD_ACCOUNT_DETAILS_SUCCESS,
        json
    };
}

function loadAccountDetailsFailure(error: string) {
    return {
        type: LOAD_ACCOUNT_DETAILS_FAILURE,
        error
    };
}

export function updateAccountDisplayNameIfNeeded(displayName: string) {
    return (dispatch: Function, getState: Function): Promise<void> => {
        const fetchUrl: string = "/account/update";

        dispatch(updateAccountDisplayName());
        return fetch(fetchUrl, { method: "post", body: JSON.stringify({ displayName }), headers: { "Content-Type": "application/json" } })
            .then(response => {
                if (!response.ok) {
                    throw response.status.toString();
                }
                return response;
            })
            .then(() => dispatch(updateAccountDisplayNameSuccess(displayName)))
            .catch(errorMessage => dispatch(updateAccountDisplayNameFailure(errorMessage)));
    };
}

function updateAccountDisplayName() {
    return {
        type: UPDATE_ACCOUNT_DISPLAY_NAME
    };
}

function updateAccountDisplayNameSuccess(displayName: string) {
    return {
        type: UPDATE_ACCOUNT_DISPLAY_NAME_SUCCESS,
        displayName
    };
}

function updateAccountDisplayNameFailure(error: string) {
    return {
        type: UPDATE_ACCOUNT_DISPLAY_NAME_FAILURE,
        error
    };
}