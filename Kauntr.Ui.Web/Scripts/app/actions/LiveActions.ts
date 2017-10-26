import { Store } from "redux";

import AppState from "../interfaces/AppState";

import * as ActionTypes from "../constants/ActionTypes";

export function updateCountdownAfterVote(json: any) {
    return {
        type: ActionTypes.COUNTDOWN_UPDATE_AFTER_VOTE,
        json
    };
}

export function updateCommentAfterVote(json: any) {
    return {
        type: ActionTypes.COMMENT_UPDATE_AFTER_VOTE,
        json
    };
}

export function updateCountdownListAfterCreate(json: any) {
    return {
        type: ActionTypes.COUNTDOWNS_UPDATE_AFTER_CREATE,
        json
    };
}

export function updateCommentListAfterCreate(json: any) {
    return {
        type: ActionTypes.COMMENTS_UPDATE_AFTER_CREATE,
        json
    };
}