import AccountState from "../interfaces/AccountState";

import {
    INVALIDATE_ACCOUNT_DETAILS,
    LOAD_ACCOUNT_DETAILS,
    LOAD_ACCOUNT_DETAILS_SUCCESS,
    LOAD_ACCOUNT_DETAILS_FAILURE,
    UPDATE_ACCOUNT_DISPLAY_NAME,
    UPDATE_ACCOUNT_DISPLAY_NAME_SUCCESS,
    UPDATE_ACCOUNT_DISPLAY_NAME_FAILURE
} from "../constants/ActionTypes";

import {
    parseRawDate
} from "../helpers/DateHelpers";

interface AccountAction {
    type: string;
    displayName?: string;
    token?: number;
    json?: any;
    error?: string;
}

export const initialState: AccountState = {
    isLoadingData: false,
    isInvalidated: true,
    isUpdatingData: false
};

export default function accountDetails(state = initialState, action: AccountAction): AccountState {
    switch (action.type) {
        case INVALIDATE_ACCOUNT_DETAILS:
            return {
                ...state,
                isInvalidated: true,
                error: null
            };
        case LOAD_ACCOUNT_DETAILS:
            return {
                ...state,
                isInvalidated: false,
                isLoadingData: true,
                token: action.token
            };
        case LOAD_ACCOUNT_DETAILS_SUCCESS:
            return {
                ...state,
                isInvalidated: true,
                isLoadingData: false,
                id: action.json.Account.Id,
                displayName: action.json.Account.DisplayName,
                email: action.json.Account.Email,
                reputation: action.json.Account.Reputation,
                createdOn: parseRawDate(action.json.Account.CreatedOn),
                isAutoSetup: action.json.Account.IsAutoSetup
            };
        case LOAD_ACCOUNT_DETAILS_FAILURE:
            return {
                ...state,
                isInvalidated: true,
                isLoadingData: false,
                error: action.error
            };
        case UPDATE_ACCOUNT_DISPLAY_NAME:
            return {
                ...state,
                isUpdatingData: true
            };
        case UPDATE_ACCOUNT_DISPLAY_NAME_SUCCESS:
            return {
                ...state,
                isUpdatingData: false,
                isAutoSetup: false,
                displayName: action.displayName
            };
        case UPDATE_ACCOUNT_DISPLAY_NAME_FAILURE:
            return {
                ...state,
                isUpdatingData: false,
                error: action.error
            };
        default:
            return state;
    }
}