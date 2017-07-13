import SharedContextState from "../interfaces/SharedContextState";

import {
    INVALIDATE_SHARED_CONTEXT,
    LOAD_SHARED_CONTEXT,
    LOAD_SHARED_CONTEXT_SUCCESS,
    LOAD_SHARED_CONTEXT_FAILURE,
    UPDATE_SHARED_CONTEXT_TITLE
} from "../constants/ActionTypes";

interface SharedContextAction {
    type: string;
    token?: number;
    json?: any;
    error?: string;
    title?: string;
}

export const initialState: SharedContextState = {
    isLoadingData: false,
    isInvalidated: true,
    currentUserAccountId: null,
    notificationsCount: null,
    title: null
};

export default function sharedContext(state = initialState, action: SharedContextAction) {
    switch (action.type) {
        case INVALIDATE_SHARED_CONTEXT:
            return {
                ...state,
                isInvalidated: true,
                error: null
            };
        case LOAD_SHARED_CONTEXT:
            return {
                ...state,
                isInvalidated: false,
                isLoadingData: true,
                token: action.token
            };
        case LOAD_SHARED_CONTEXT_SUCCESS:
            return {
                ...state,
                isInvalidated: true,
                isLoadingData: false,
                notificationsCount: action.json.NotificationsCount,
                currentUserAccountId: action.json.CurrentUserAccountId
            };
        case LOAD_SHARED_CONTEXT_FAILURE:
            return {
                ...state,
                isInvalidated: true,
                isLoadingData: false,
                error: action.error
            };
        case UPDATE_SHARED_CONTEXT_TITLE:
            return {
                ...state,
                title: action.title
            };
        default:
            return state;
    }
}