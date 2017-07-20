import * as moment from "moment";

import AppState from "../interfaces/AppState";

import * as ActionTypes from "../constants/ActionTypes";

import { handleServerError } from "./ErrorActions";

export function invalidateSharedContext() {
    return {
        type: ActionTypes.INVALIDATE_SHARED_CONTEXT
    };
}

export function fetchSharedContextIfNeeded() {
    return (dispatch: Function, getState: Function): Promise<void> => {
        if (shouldFetchSharedContext(getState())) {
            const token: number = moment().unix();
            const fetchUrl: string = `/sharedcontext/index?token=${token}`;
            dispatch(loadSharedContext(token));

            return fetch(fetchUrl)
                .then(response => {
                    if (!response.ok) {
                        throw response;
                    }
                    return response.json();
                })
                .then(json => {
                    if (shouldProcessSharedContextResponse(getState(), json.Token)) {
                        dispatch(loadSharedContextSuccess(json));
                    }
                })
                .catch((response: Response) => handleServerError(response, dispatch, loadSharedContextFailure));
        }
    };
}

function shouldProcessSharedContextResponse(state: AppState, token: number): boolean {
    return state.sharedContext.token === token;
}

function shouldFetchSharedContext(state: AppState): boolean {
    const { isLoadingData, isInvalidated } = state.sharedContext;
    console.log(state.sharedContext);
    return !isLoadingData && isInvalidated;
}

function loadSharedContext(token: number) {
    return {
        type: ActionTypes.LOAD_SHARED_CONTEXT,
        token
    };
}

function loadSharedContextSuccess(json: any) {
    return {
        type: ActionTypes.LOAD_SHARED_CONTEXT_SUCCESS,
        json
    };
}

function loadSharedContextFailure() {
    return {
        type: ActionTypes.LOAD_SHARED_CONTEXT_FAILURE
    };
}

export function updateSharedContextTitle(title: string) {
    return {
        type: ActionTypes.UPDATE_SHARED_CONTEXT_TITLE,
        title
    };
}
