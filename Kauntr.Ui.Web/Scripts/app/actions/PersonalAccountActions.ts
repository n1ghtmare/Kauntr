import * as moment from "moment";

import AppState from "../interfaces/AppState";

import {
    INVALIDATE_PERSONAL_ACCOUNT,
    LOAD_PERSONAL_ACCOUNT,
    LOAD_PERSONAL_ACCOUNT_SUCCESS,
    LOAD_PERSONAL_ACCOUNT_FAILURE
} from "../constants/ActionTypes";

export function invalidatePersonalAccount() {
    return {
        type: INVALIDATE_PERSONAL_ACCOUNT
    };
}

export function fetchPersonalAccountIfNeeded() {
    return (dispatch: Function, getState: Function): Promise<void> => {
        if (shouldFetchPersonalAccount(getState())) {
            const token: number = moment().unix();
            const fetchUrl: string = "/account/index";
            dispatch(loadPersonalAccount(token));

            return fetch(fetchUrl)
                .then(response => {
                    if (!response.ok) {
                        throw response.status.toString();
                    }
                    return response.json();
                })
                .then(json => {
                    if (shouldProcessPersonalAccountResponse(getState(), json.Token)) {
                        dispatch(loadPersonalAccountSuccess(json));
                    }
                })
                .catch(errorMessage => dispatch(loadPersonalAccountFailure(errorMessage)));
        }
    };
}

function shouldProcessPersonalAccountResponse(state: AppState, token: number): boolean {
    return state.personalAccount.token === token;
}

function shouldFetchPersonalAccount(state: AppState): boolean {
    const { isLoadingData, isInvalidated } = state.personalAccount;
    return !isLoadingData && isInvalidated;
}

function loadPersonalAccount(token: number) {
    return {
        type: LOAD_PERSONAL_ACCOUNT,
        token
    };
}

function loadPersonalAccountSuccess(json: any) {
    return {
        type: LOAD_PERSONAL_ACCOUNT_SUCCESS,
        json
    };
}

function loadPersonalAccountFailure(error: string) {
    return {
        type: LOAD_PERSONAL_ACCOUNT_FAILURE,
        error
    };
}
