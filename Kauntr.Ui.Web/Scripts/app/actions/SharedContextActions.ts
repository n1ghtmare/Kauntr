import * as moment from "moment";

import AppState from "../interfaces/AppState";

import {
    INVALIDATE_SHARED_CONTEXT,
    LOAD_SHARED_CONTEXT,
    LOAD_SHARED_CONTEXT_SUCCESS,
    LOAD_SHARED_CONTEXT_FAILURE,
    UPDATE_SHARED_CONTEXT_TITLE
} from "../constants/ActionTypes";

export function invalidateSharedContext() {
    return {
        type: INVALIDATE_SHARED_CONTEXT
    };
}

export function fetchSharedContextIfNeeded() {
    return (dispatch: Function, getState: Function) => {
        if(shouldFetchSharedContext(getState())) {
            const token: number = moment().unix();
            const fetchUrl: string = `/sharedcontext/index?token=${token}`;
            dispatch(loadSharedContext(token));

            return fetch(fetchUrl)
                .then(response => {
                    if(!response.ok) {
                        throw Error(response.status.toString());
                    }
                    return response.json();
                })
                .then(json => {
                    dispatch(loadSharedContextSuccess(json));
                })
                .catch(errorStatusCode => {
                    dispatch(loadSharedContextFailure(`Error - status code - ${errorStatusCode}`));
                });
        }
    };
}

function shouldFetchSharedContext(state: AppState): boolean {
    let { isLoadingData, isInvalidated } = state.sharedContext;
    return !isLoadingData && isInvalidated;
}

function loadSharedContext(token: number) {
    return {
        type: LOAD_SHARED_CONTEXT,
        token
    };
}

function loadSharedContextSuccess(json: any) {
    return {
        type: LOAD_SHARED_CONTEXT_SUCCESS,
        json
    };
}

function loadSharedContextFailure(error: string) {
    return {
        type: LOAD_SHARED_CONTEXT_FAILURE,
        error
    };
}

export function updateSharedContextTitle(title: string) {
    return {
        type: UPDATE_SHARED_CONTEXT_TITLE,
        title
    };
}
