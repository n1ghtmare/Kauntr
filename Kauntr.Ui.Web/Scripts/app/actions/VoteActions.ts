import AppState from "../interfaces/AppState";
import CommentListState from "../interfaces/CommentListState";
import CommentState from "../interfaces/CommentState";

import * as ActionTypes from "../constants/ActionTypes";

import { handleServerError } from "./ErrorActions";

export function submitCommentVote(commentId: number, value: number) {
    return (dispatch: Function, getState: Function): Promise<void> => {
        if (shouldSubmitVote(commentId, getState())) {
            dispatch(commentVoteCast(commentId));

            const data: string = JSON.stringify({ CommentId: commentId, Value: value });

            return fetch("/vote/comment", { method: "post", body: data, headers: { "Content-Type": "application/json" } })
                .then(response => {
                    if (!response.ok) {
                        throw response;
                    }
                })
                .then(json => dispatch(commentVoteCastSuccess(json)))
                .catch((response: Response) => handleServerError(response, dispatch, commentVoteCastFailure));
        }
    };
}

function shouldSubmitVote(commentId: number, state: AppState) {
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