import CountdownListState from "../interfaces/CountdownListState";
import CountdownState from "../interfaces/CountdownState";
import CountdownDisplayOrderType from "../interfaces/CountdownDisplayOrderType";
import CountdownListFilterState from "../interfaces/CountdownListFilterState";

import { parseRawDate } from "../helpers/DateHelpers";

import * as ActionTypes from "../constants/ActionTypes";

interface CountdownListAction {
    type: string;
    token?: number;
    json?: any;
    countdownId?: number;
}

export const initialFilterState: CountdownListFilterState = {
    query: "",
    isCreatedByCurrentUser: false,
    isCurrentlyActive: true
};

export const initialState: CountdownListState = {
    countdowns: [],
    isLoadingData: false,
    isInFilterMode: false,
    page: 1,
    displayOrderType: CountdownDisplayOrderType.Trending,
    filters: initialFilterState,
    token: null,
    total: 0,
    totalCreationsFromServer: 0
};

export default function countdownList(state = initialState, action: CountdownListAction): CountdownListState {
    switch (action.type) {
        case ActionTypes.LOAD_COUNTDOWNS:
            return {
                ...state,
                isLoadingData: true,
                totalCreationsFromServer: 0,
                token: action.token
            };
        case ActionTypes.LOAD_COUNTDOWNS_SUCCESS:
            return {
                ...state,
                isLoadingData: false,
                token: null,
                page: parseInt(action.json.Page, 10),
                total: parseInt(action.json.Total, 10),
                displayOrderType: parseInt(action.json.DisplayOrderType),
                filters: parseFilter(action.json.Filter),
                countdowns: parseCountdowns(action.json.Countdowns)
            };
        case ActionTypes.LOAD_COUNTDOWN_DETAILS_FAILURE:
            return {
                ...state,
                isLoadingData: false,
                page: 1,
                displayOrderType: CountdownDisplayOrderType.Latest,
                total: 0,
                token: null,
                countdowns: []
            };
        case ActionTypes.TOGGLE_FILTER_MODE:
            return {
                ...state,
                isInFilterMode: !state.isInFilterMode
            };
        case ActionTypes.COUNTDOWNS_UPDATE_AFTER_CREATE:
            return {
                ...state,
                totalCreationsFromServer: state.totalCreationsFromServer + 1
            };
        case ActionTypes.COUNTDOWN_VOTE_CAST:
        case ActionTypes.COUNTDOWN_VOTE_CAST_SUCCESS:
        case ActionTypes.COUNTDOWN_VOTE_CAST_FAILURE:
        case ActionTypes.COUNTDOWN_UPDATE_AFTER_VOTE:
        case ActionTypes.COMMENTS_UPDATE_AFTER_CREATE:
            return {
                ...state,
                countdowns: countdowns(state.countdowns, action)
            };
        // TODO - Handle state for Countdown deletion
        // case ActionTypes.DELETE_COUNTDOWN:
        // case ActionTypes.DELETE_COUNTDOWN_SUCCESS:
        // case ActionTypes.DELETE_COUNTDOWN_FAILURE:
        default:
            return state;
    }
}

function countdowns(state: Array<CountdownState> = [], action: CountdownListAction): Array<CountdownState> {
    switch (action.type) {
        case ActionTypes.COUNTDOWN_VOTE_CAST:
            return state.map(x => x.id === action.countdownId
                ? {
                    ...x,
                    isCastingVote: true
                }
                : x);
        case ActionTypes.COUNTDOWN_VOTE_CAST_SUCCESS:
            return state.map(x => {
                return x.id === parseInt(action.json.CountdownId, 10)
                    ? {
                        ...x,
                        isCastingVote: false,
                        voteScore: parseInt(action.json.VoteScore, 10),
                        currentUserVote: action.json.CurrentUserVote !== null ? parseInt(action.json.CurrentUserVote, 10) : null
                    }
                    : x;
            });
        case ActionTypes.COUNTDOWN_VOTE_CAST_FAILURE:
            return state.map(x => x.id === action.countdownId
                ? {
                    ...x,
                    isCastingVote: false
                }
                : x);
        case ActionTypes.COUNTDOWN_UPDATE_AFTER_VOTE:
            return state.map(x => x.id === parseInt(action.json.Id, 10)
                ? {
                    ...x,
                    voteScore: parseInt(action.json.VoteScore, 10),
                    currentUserVote: action.json.CurrentUserVote !== null ? parseInt(action.json.CurrentUserVote, 10) : null
                }
                : x);
        case ActionTypes.COMMENTS_UPDATE_AFTER_CREATE:
            return state.map(x => x.id === parseInt(action.json.CountdownId, 10)
                ? {
                    ...x,
                    commentsCount: x.commentsCount + 1
                }
                : x);
        default:
            return state;
    }
}

function parseFilter(filter: any): CountdownListFilterState {
    return {
        query: filter.Query,
        isCreatedByCurrentUser: filter.IsCreatedByCurrentUser,
        isCurrentlyActive: filter.IsCurrentlyActive
    };
}

function parseCountdowns(countdowns: Array<any>): Array<CountdownState> {
    return countdowns.map(x => ({
        id: parseInt(x.Id, 10),
        description: x.Description,
        endsOn: parseRawDate(x.EndsOn),
        commentsCount: parseInt(x.CommentsCount, 10),
        createdOn: parseRawDate(x.CreatedOn),
        createdByAccountId: parseInt(x.CreatedByAccountId, 10),
        createdByDisplayName: x.CreatedByDisplayName,
        createdByGravatarUrl: x.CreatedByGravatarUrl,
        voteScore: parseInt(x.VoteScore, 10),
        currentUserVote: x.CurrentUserVote !== null ? parseInt(x.CurrentUserVote, 10) : null,
        isCreatedByCurrentUser: x.IsCreatedByCurrentUser
    }) as CountdownState);
}