import CountdownState from "../interfaces/CountdownState";

import * as ActionTypes from "../constants/ActionTypes";

import {
    parseRawDate
} from "../helpers/DateHelpers";

interface CountdownAction {
    type: string;
    json?: any;
}

export const initialState: CountdownState = {
    isCreatingNew: false,
    isLoadingData: false,
};

export default function countdown(state = initialState, action: CountdownAction): CountdownState {
    switch (action.type) {
        case ActionTypes.CREATE_COUNTDOWN:
            return {
                ...state,
                isCreatingNew: true
            };
        case ActionTypes.CREATE_COUNTDOWN_SUCCESS:
        case ActionTypes.CREATE_COUNTDOWN_FAILURE:
            return {
                ...state,
                isCreatingNew: false
            };

        case ActionTypes.LOAD_COUNTDOWN:
            return {
                ...state,
                isLoadingData: true
            };
        case ActionTypes.LOAD_COUNTDOWN_SUCCESS:
            return {
                ...state,
                isLoadingData: false,
                id: action.json.Id,
                description: action.json.Description,
                endsOn: parseRawDate(action.json.EndsOn),
                commentsCount: action.json.CommentsCount,
                createdOn: parseRawDate(action.json.CreatedOn),
                createdByAccountId: action.json.CreateByAccountId,
                createdByDisplayName: action.json.CreatedByDisplayName,
                voteScore: action.json.VoteScore,
                currentUserVote: action.json.CurrentUserVote
            };
        case ActionTypes.LOAD_COUNTDOWN_FAILURE:
            return {
                ...state,
                isLoadingData: false
            };
        default:
            return state;
    }
}