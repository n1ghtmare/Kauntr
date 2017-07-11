import PersonalAccountState from "../interfaces/PersonalAccountState";

import {
    INVALIDATE_PERSONAL_ACCOUNT,
    LOAD_PERSONAL_ACCOUNT,
    LOAD_PERSONAL_ACCOUNT_SUCCESS,
    LOAD_PERSONAL_ACCOUNT_FAILURE
} from "../constants/ActionTypes";

interface PersonalAccountAction {
    type: string;
    token?: number;
    json?: any;
    error?: string;
}

export const initialState: PersonalAccountState = {
    isLoadingData: false,
    isInvalidated: true
};

export default function personalAccount(state = initialState, action: PersonalAccountAction) {
    switch (action.type) {
        case INVALIDATE_PERSONAL_ACCOUNT:
            return {
                ...state,
                isInvalidated: true,
                error: null
            };
        case LOAD_PERSONAL_ACCOUNT:
            return {
                ...state,
                isInvalidated: false,
                isLoadingData: true,
                token: action.token
            };
        case LOAD_PERSONAL_ACCOUNT_SUCCESS:
            return {
                ...state,
                isInvalidated: true,
                isLoadingData: false,
                // TODO - map Account props
            };
        case LOAD_PERSONAL_ACCOUNT_FAILURE:
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