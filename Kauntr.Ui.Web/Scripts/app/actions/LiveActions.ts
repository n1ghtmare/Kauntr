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