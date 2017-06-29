import SharedContextState from "../interfaces/SharedContextState";

import {
    INVALIDATE_SHARED_CONTEXT,
    LOAD_SHARED_CONTEXT,
    LOAD_SHARED_CONTEXT_SUCCESS,
    LOAD_SHARED_CONTEXT_FAILURE
} from "../constants/ActionTypes";

interface SharedContextAction {
    type: string;
    token?: number;
    json?: any;
    error?: string;
}

export const initialState: SharedContextState = {
    isLoadingData: false,
    isInvalidated: true,
    currentUserId: null,
    notificationsCount: null
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
                // TODO - map/parse the json for user and notifications count
            };
        case LOAD_SHARED_CONTEXT_FAILURE:
            return {
                ...state,
                isInvalidated: true,
                isLoadingData: false,
                error: action.error
            };
        default:
            return state;
    }
}