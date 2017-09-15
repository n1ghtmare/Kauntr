import * as moment from "moment";

import AppState from "../interfaces/AppState";

import * as ActionTypes from "../constants/ActionTypes";

import { handleServerError } from "./ErrorActions";

// TODO - Add pagination logic and ability to order by "recent", "top", "oldest"
export function fetchCommentsIfNeeded(countdownId: number) {
    return (dispatch: Function, getState: Function): Promise<void> => {
        if (shouldFetchComments(getState())) {
            const token: number = moment().unix();

            dispatch(loadComments(token));

            return fetch(`/comment/index?countdownId=${countdownId}`)
                .then(response => {
                    if (!response.ok) {
                        throw response;
                    }
                    return response.json();
                })
                .then(json => {
                    if (shouldProcessComments(getState(), json.Token)) {
                        dispatch(loadCommentsSuccess(json));
                    }
                })
                .catch((response: Response) => handleServerError(response, dispatch, loadCommentsFailure));
        }
    }
}

function shouldProcessComments(state: AppState, token: number): boolean {
    // return state.countdown.comments.token === token;
    return true;
}

function shouldFetchComments(state: AppState): boolean {
    return true;
    // return !state.countdown.comments.isLoadingData;
}

function loadComments(token: number) {
    return {
        type: ActionTypes.LOAD_COMMENTS,
        token
    };
}

function loadCommentsSuccess(json: any) {
    return {
        type: ActionTypes.LOAD_COMMENTS_SUCCESS,
        json
    };
}

function loadCommentsFailure() {
    return {
        type: ActionTypes.LOAD_COMMENTS_FAILURE
    };
}

