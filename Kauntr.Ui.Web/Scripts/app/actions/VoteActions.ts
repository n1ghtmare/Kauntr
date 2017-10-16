import AppState from "../interfaces/AppState";
import CommentListState from "../interfaces/CommentListState";
import CommentState from "../interfaces/CommentState";
import CountdownState from "../interfaces/CountdownState";

import * as ActionTypes from "../constants/ActionTypes";

import { handleServerError } from "./ErrorActions";

export function submitCommentVote(commentId: number, value: number) {
    return (dispatch: Function, getState: Function): Promise<void> => {
        if (shouldSubmitCommentVote(commentId, getState())) {
            dispatch(commentVoteCast(commentId));

            const data: string = JSON.stringify({ CommentId: commentId, Value: value });

            return fetch("/comment/vote", { method: "post", body: data, headers: { "Content-Type": "application/json" } })
                .then(response => {
                    if (!response.ok) {
                        throw response;
                    }
                    return response.json();
                })
                .then(json => dispatch(commentVoteCastSuccess(json)))
                .catch((response: Response) => handleServerError(response, dispatch, commentVoteCastFailure));
        }
    };
}

function shouldSubmitCommentVote(commentId: number, state: AppState): boolean {
    const { comments } = state.countdown.commentList;
    if (comments === null || comments.length === 0) {
        return false;
    }

    const results: Array<CommentState> = comments.filter(x => x.id === commentId);
    return results.length !== 0 && !results[0].isCastingVote;
}

function commentVoteCast(commentId: number) {
    return {
        type: ActionTypes.COMMENT_VOTE_CAST,
        commentId
    };
}

function commentVoteCastSuccess(json: any) {
    return {
        type: ActionTypes.COMMENT_VOTE_CAST_SUCCESS,
        json
    };
}

function commentVoteCastFailure() {
    return {
        type: ActionTypes.COMMENT_VOTE_CAST_FAILURE
    };
}


export function submitCountdownVote(countdownId: number, value: number) {
    return (dispatch: Function, getState: Function): Promise<void> => {
        if (shouldSubmitCountdownVote(countdownId, getState())) {
            dispatch(countdownVoteCast(countdownId));

            const data: string = JSON.stringify({ CountdownId: countdownId, Value: value });

            return fetch("/countdown/vote", { method: "post", body: data, headers: { "Content-Type": "application/json" } })
                .then(response => {
                    if (!response.ok) {
                        throw response;
                    }
                    return response.json();
                })
                .then(json => dispatch(countdownVoteCastSuccess(json)))
                .catch((response: Response) => handleServerError(response, dispatch, countdownVoteCastFailure));
        }
    };
}

function shouldSubmitCountdownVote(countdownId: number, state: AppState): boolean {
    const { countdown } = state;
    console.log(countdown);
    if (countdown.id !== null && countdown.id === countdownId) {
        return !countdown.isCastingVote;
    }

    const { countdowns } = state.countdownList;
    if (countdowns === null || countdowns.length === 0) {
        return false;
    }

    const results: Array<CountdownState> = countdowns.filter(x => x.id === countdownId);
    return results.length !== 0 && !results[0].isCastingVote;
}

function countdownVoteCast(countdownId: number) {
    return {
        type: ActionTypes.COUNTDOWN_VOTE_CAST,
        countdownId
    };
}

function countdownVoteCastSuccess(json: any) {
    return {
        type: ActionTypes.COUNTDOWN_VOTE_CAST_SUCCESS,
        json
    };
}

function countdownVoteCastFailure() {
    return {
        type: ActionTypes.COUNTDOWN_VOTE_CAST_FAILURE
    };
}