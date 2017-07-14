import * as moment from "moment";

import AppState from "../interfaces/AppState";

import {
    INVALIDATE_ACCOUNT_DETAILS,
    LOAD_ACCOUNT_DETAILS,
    LOAD_ACCOUNT_DETAILS_SUCCESS,
    LOAD_ACCOUNT_DETAILS_FAILURE
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