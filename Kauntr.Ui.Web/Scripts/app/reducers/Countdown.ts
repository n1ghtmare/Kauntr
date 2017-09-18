import CountdownState from "../interfaces/CountdownState";
import CommentListState from "../interfaces/CommentListState";
import CommentState from "../interfaces/CommentState";

import * as ActionTypes from "../constants/ActionTypes";

import {
    parseRawDate
} from "../helpers/DateHelpers";

interface CountdownAction {
    type: string;
    token?: number;
    json?: any;
}

export const initialCommentState: CommentListState = {
    comments: [],
    isLoadingData: false,
    page: 1,
    token: null,
    total: null
};

export const initialState: CountdownState = {
    isCreatingNew: false,
    isLoadingData: false,
    createdOn: null,
    endsOn: null,
    commentList: initialCommentState
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
                createdByAccountId: action.json.CreatedByAccountId,
                createdByDisplayName: action.json.CreatedByDisplayName,
                createdByGravatarUrl: action.json.CreatedByGravatarUrl,
                voteScore: action.json.VoteScore,
                currentUserVote: action.json.CurrentUserVote
            };
        case ActionTypes.LOAD_COUNTDOWN_FAILURE:
            return {
                ...state,
                isLoadingData: false
            };
        case ActionTypes.LOAD_COMMENTS:
        case ActionTypes.LOAD_COMMENTS_SUCCESS:
        case ActionTypes.LOAD_COMMENTS_FAILURE:
            return {
                ...state,
                commentList: commentList(state.commentList, action)
            };
        default:
            return state;
    }
}

function commentList(state = initialCommentState, action: CountdownAction): CommentListState {
    switch (action.type) {
        case ActionTypes.LOAD_COMMENTS:
            return {
                ...state,
                isLoadingData: true,
                token: action.token
            };
        case ActionTypes.LOAD_COMMENTS_SUCCESS:
            return {
                ...state,
                isLoadingData: false,
                token: null,
                page: parseInt(action.json.Page, 10),
                total: parseInt(action.json.Total, 10),
                comments: parseComments(action.json.Comments)
            };
        case ActionTypes.LOAD_COMMENTS_FAILURE:
            return {
                ...state,
                isLoadingData: false,
                page: 1,
                total: null,
                token: null,
                comments: []
            };
        default:
            return state;
    }
}

function parseComments(comments: Array<any>): Array<CommentState> {
    return comments.map(x => ({
        id: parseInt(x.Id, 10),
        text: x.Text,
        createdByAccountId: x.CreatedByAccountId,
        createdByDisplayName: x.CreatedByDisplayName,
        createdOn: parseRawDate(x.CreatedOn),
        currentUserVote: parseInt(x.CurrentUserVote, 10),
        voteScore: parseInt(x.VoteScore, 10),
        createdByGravatarUrl: x.CreatedByGravatarUrl
    }) as CommentState);
}