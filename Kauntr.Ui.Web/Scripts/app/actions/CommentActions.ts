import * as moment from "moment";

import AppState from "../interfaces/AppState";
import CommentDisplayOrderType from "../interfaces/CommentDisplayOrderType";

import * as ActionTypes from "../constants/ActionTypes";

import { handleServerError } from "./ErrorActions";

// TODO - Add pagination logic and ability to order by "recent", "top", "oldest"
export function fetchCommentsIfNeeded(countdownId: number, page: number, displayOrderType: CommentDisplayOrderType) {
    return (dispatch: Function, getState: Function): Promise<void> => {
        if (shouldFetchComments(getState())) {
            const token: number = moment().unix();

            dispatch(loadComments(token));

            return fetch(`/comment/index?CountdownId=${countdownId}&Page=${page}&DisplayOrderType=${displayOrderType}&Token=${token}`)
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

export function submitComment(countdownId: number, text: string) {
    return (dispatch: Function, getState: Function): Promise<void> => {
        if (shouldCreateComment(getState())) {
            dispatch(createComment());

            const data: string = JSON.stringify({ CountdownId: countdownId, Text: text });

            return fetch("/comment/create", { method: "post", body: data, headers: { "Content-Type": "application/json" } })
                .then(response => {
                    if (!response.ok) {
                        throw response;
                    }
                })
                .then(() => dispatch(createCommentSuccess()))
                .catch((response: Response) => handleServerError(response, dispatch, createCommentFailure));
        }
    };
}

function shouldCreateComment(state: AppState) {
    return !state.countdown.commentList.isCreatingNew;
}

function createComment() {
    return {
        type: ActionTypes.CREATE_COMMENT
    };
}

function createCommentSuccess() {
    return {
        type: ActionTypes.CREATE_COMMENT_SUCCESS
    };
}

function createCommentFailure() {
    return {
        type: ActionTypes.CREATE_COMMENT_FAILURE
    };
}



// TODO - ? Split into "VoteActions" instead
function commentVoteCast() {
    return {
        type: ActionTypes.COMMENT_VOTE_CAST
    };
}

function commentVoteCastSuccess() {
    return {
        type: ActionTypes.COMMENT_VOTE_CAST_SUCCESS
    };
}

function commentVoteCastFailure() {
    return {
        type: ActionTypes.COMMENT_VOTE_CAST_FAILURE
    };
}