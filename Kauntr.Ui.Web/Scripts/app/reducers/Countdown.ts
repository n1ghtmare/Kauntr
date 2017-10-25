import CountdownState from "../interfaces/CountdownState";
import CommentListState from "../interfaces/CommentListState";
import CommentState from "../interfaces/CommentState";
import CommentDisplayOrderType from "../interfaces/CommentDisplayOrderType";

import * as ActionTypes from "../constants/ActionTypes";

import { parseRawDate } from "../helpers/DateHelpers";

interface CountdownAction {
    type: string;
    token?: number;
    json?: any;
    commentId?: number;
}

export const initialCommentState: CommentListState = {
    comments: [],
    isLoadingData: false,
    isCreatingNew: false,
    page: 1,
    displayOrderType: CommentDisplayOrderType.Latest,
    token: null,
    total: 0
};

export const initialState: CountdownState = {
    isCreatingNew: false,
    isLoadingData: false,
    isExpanded: false,
    isCastingVote: false,
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

        case ActionTypes.LOAD_COUNTDOWN_DETAILS:
            return {
                ...state,
                isLoadingData: true
            };
        case ActionTypes.LOAD_COUNTDOWN_DETAILS_SUCCESS:
            return {
                ...state,
                isLoadingData: false,
                id: parseInt(action.json.Id, 10),
                description: action.json.Description,
                endsOn: parseRawDate(action.json.EndsOn),
                commentsCount: parseInt(action.json.CommentsCount, 10),
                createdOn: parseRawDate(action.json.CreatedOn),
                createdByAccountId: parseInt(action.json.CreatedByAccountId, 10),
                createdByDisplayName: action.json.CreatedByDisplayName,
                createdByGravatarUrl: action.json.CreatedByGravatarUrl,
                voteScore: parseInt(action.json.VoteScore, 10),
                currentUserVote: action.json.CurrentUserVote !== null ? parseInt(action.json.CurrentUserVote, 10) : null,
                isCreatedByCurrentUser: action.json.IsCreatedByCurrentUser
            };
        case ActionTypes.LOAD_COUNTDOWN_DETAILS_FAILURE:
            return {
                ...state,
                isLoadingData: false
            };
        case ActionTypes.COUNTDOWN_VOTE_CAST:
            return {
                ...state,
                isCastingVote: true
            };
        case ActionTypes.COUNTDOWN_VOTE_CAST_SUCCESS:
            return {
                ...state,
                isCastingVote: false,
                voteScore: parseInt(action.json.VoteScore, 10),
                currentUserVote: action.json.CurrentUserVote !== null ? parseInt(action.json.CurrentUserVote, 10) : null
            };
        case ActionTypes.COUNTDOWN_VOTE_CAST_FAILURE:
            return {
                ...state,
                isCastingVote: false
            };
        case ActionTypes.COUNTDOWN_UPDATE_AFTER_VOTE:
            return parseInt(action.json.Id, 10) !== state.id ? state : {
                ...state,
                voteScore: parseInt(action.json.VoteScore, 10),
                currentUserVote: action.json.CurrentUserVote !== null ? parseInt(action.json.CurrentUserVote, 10) : null
            };
        case ActionTypes.LOAD_COMMENTS:
        case ActionTypes.LOAD_COMMENTS_SUCCESS:
        case ActionTypes.LOAD_COMMENTS_FAILURE:
        case ActionTypes.CREATE_COMMENT:
        case ActionTypes.CREATE_COMMENT_SUCCESS:
        case ActionTypes.CREATE_COMMENT_FAILURE:
        case ActionTypes.COMMENT_VOTE_CAST:
        case ActionTypes.COMMENT_VOTE_CAST_SUCCESS:
        case ActionTypes.COMMENT_VOTE_CAST_FAILURE:
        case ActionTypes.COMMENT_UPDATE_AFTER_VOTE:
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
                displayOrderType: parseInt(action.json.DisplayOrderType),
                comments: parseComments(action.json.Comments)
            };
        case ActionTypes.LOAD_COMMENTS_FAILURE:
            return {
                ...state,
                isLoadingData: false,
                page: 1,
                displayOrderType: CommentDisplayOrderType.Latest,
                total: null,
                token: null,
                comments: []
            };
        case ActionTypes.CREATE_COMMENT:
            return {
                ...state,
                isCreatingNew: true
            };
        case ActionTypes.CREATE_COMMENT_SUCCESS:
        case ActionTypes.CREATE_COMMENT_FAILURE:
            return {
                ...state,
                isCreatingNew: false
            };
        case ActionTypes.COMMENT_VOTE_CAST:
        case ActionTypes.COMMENT_VOTE_CAST_SUCCESS:
        case ActionTypes.COMMENT_VOTE_CAST_FAILURE:
        case ActionTypes.COMMENT_UPDATE_AFTER_VOTE:
            return {
                ...state,
                comments: commentSubList(state.comments, action)
            };
        default:
            return state;
    }
}

function commentSubList(state: Array<CommentState> = [], action: CountdownAction): Array<CommentState> {
    switch (action.type) {
        case ActionTypes.COMMENT_VOTE_CAST:
            return state.map(x => x.id === action.commentId
                ? {
                    ...x,
                    isCastingVote: true
                }
                : x);
        case ActionTypes.COMMENT_VOTE_CAST_SUCCESS:
            return state.map(x => {
                return x.id === parseInt(action.json.CommentId, 10)
                    ? {
                        ...x,
                        isCastingVote: false,
                        voteScore: parseInt(action.json.VoteScore, 10),
                        currentUserVote: action.json.CurrentUserVote !== null ? parseInt(action.json.CurrentUserVote, 10) : null
                    }
                    : x;
            });
        case ActionTypes.COMMENT_VOTE_CAST_FAILURE:
            return state.map(x => x.id === action.commentId
                ? {
                    ...x,
                    isCastingVote: false
                }
                : x);
        case ActionTypes.COMMENT_UPDATE_AFTER_VOTE:
            return state.map(x => x.id === parseInt(action.json.Id, 10)
                ? {
                    ...x,
                    voteScore: parseInt(action.json.VoteScore, 10),
                    currentUserVote: action.json.CurrentUserVote !== null ? parseInt(action.json.CurrentUserVote, 10) : null
                }
                : x);
        default:
            return state;
    }
}

function parseComments(comments: Array<any>): Array<CommentState> {
    return comments.map(x => ({
        isCastingVote: false,
        id: parseInt(x.Id, 10),
        text: x.Text,
        createdByAccountId: x.CreatedByAccountId,
        createdByDisplayName: x.CreatedByDisplayName,
        createdOn: parseRawDate(x.CreatedOn),
        currentUserVote: x.CurrentUserVote !== null ? parseInt(x.CurrentUserVote, 10) : null,
        voteScore: parseInt(x.VoteScore, 10),
        createdByGravatarUrl: x.CreatedByGravatarUrl,
        isCreatedByCurrentUser: x.IsCreatedByCurrentUser
    }) as CommentState);
}