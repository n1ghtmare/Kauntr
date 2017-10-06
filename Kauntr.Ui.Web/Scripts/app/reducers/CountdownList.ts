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
    total: 0
};

export default function countdownList(state = initialState, action: CountdownListAction): CountdownListState {
    switch (action.type) {
        case ActionTypes.LOAD_COUNTDOWNS:
            return {
                ...state,
                isLoadingData: true,
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
        currentUserVote: parseInt(x.CurrentUserVote, 10)
    }) as CountdownState);
}