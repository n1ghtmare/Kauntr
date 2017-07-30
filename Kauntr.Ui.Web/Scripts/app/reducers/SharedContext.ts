import SharedContextState from "../interfaces/SharedContextState";

import * as ActionTypes from "../constants/ActionTypes";

interface SharedContextAction {
    type: string;
    token?: number;
    json?: any;
    title?: string;
}

export const initialState: SharedContextState = {
    isLoadingData: false,
    isInvalidated: true,
    currentUserAccountId: null,
    notificationsCount: null,
    title: null
};

export default function sharedContext(state = initialState, action: SharedContextAction): SharedContextState {
    switch (action.type) {
        case ActionTypes.INVALIDATE_SHARED_CONTEXT:
            return {
                ...state,
                isInvalidated: true
            };
        case ActionTypes.LOAD_SHARED_CONTEXT:
            return {
                ...state,
                isInvalidated: false,
                isLoadingData: true,
                token: action.token
            };
        case ActionTypes.LOAD_SHARED_CONTEXT_SUCCESS:
            return {
                ...state,
                isInvalidated: false,
                isLoadingData: false,
                notificationsCount: action.json.NotificationsCount,
                currentUserAccountId: action.json.CurrentUserAccountId
            };
        case ActionTypes.LOAD_SHARED_CONTEXT_FAILURE:
            return {
                ...state,
                isInvalidated: true,
                isLoadingData: false
            };
        case ActionTypes.UPDATE_SHARED_CONTEXT_TITLE:
            return {
                ...state,
                title: action.title
            };
        default:
            return state;
    }
}