import * as moment from "moment";

import AppState from "../interfaces/AppState";

import * as ActionTypes from "../constants/ActionTypes";

import { handleServerError } from "./ErrorActions";

// TODO - Add pagination logic and ability to order by "recent", "top", "oldest"
export function fetchCommentsIfNeeded(countdownId: number, page: number) {
    return (dispatch: Function, getState: Function): Promise<void> => {
        if (shouldFetchComments(getState())) {
            const token: number = moment().unix();

            dispatch(loadComments(token));

            return fetch(`/comment/index?CountdownId=${countdownId}&Page=${page}&Token=${token}`)
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
    };
}

function shouldProcessComments(state: AppState, token: number): boolean {
    return state.countdown.commentList.token === token;
}

function shouldFetchComments(state: AppState): boolean {
    return !state.countdown.commentList.isLoadingData;
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

