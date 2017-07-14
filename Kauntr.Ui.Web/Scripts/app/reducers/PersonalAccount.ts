import AccountState from "../interfaces/AccountState";

import {
    INVALIDATE_PERSONAL_ACCOUNT,
    LOAD_PERSONAL_ACCOUNT,
    LOAD_PERSONAL_ACCOUNT_SUCCESS,
    LOAD_PERSONAL_ACCOUNT_FAILURE
} from "../constants/ActionTypes";

import {
    parseRawDate
} from "../helpers/DateHelpers";

interface PersonalAccountAction {
    type: string;
    token?: number;
    json?: any;
    error?: string;
}

export const initialState: AccountState = {
    isLoadingData: false,
    isInvalidated: true
};

export default function personalAccount(state = initialState, action: PersonalAccountAction): AccountState {
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
                displayName: action.json.Account.DisplayName,
                email: action.json.Account.Email,
                reputation: action.json.Account.Reputation,
                createdOn: parseRawDate(action.json.Account.CreatedOn),
                isAutoSetup: action.json.Account.IsAutoSetup
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