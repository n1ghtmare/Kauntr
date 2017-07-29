import AccountState from "../interfaces/AccountState";

import * as ActionTypes from "../constants/ActionTypes";

import {
    parseRawDate
} from "../helpers/DateHelpers";

interface AccountAction {
    type: string;
    displayName?: string;
    token?: number;
    json?: any;
}

export const initialState: AccountState = {
    isLoadingData: false,
    isInvalidated: true,
    isUpdatingData: false
};

export default function account(state = initialState, action: AccountAction): AccountState {
    switch (action.type) {
        case ActionTypes.LOAD_ACCOUNT_DETAILS:
            return {
                ...state,
                isInvalidated: false,
                isLoadingData: true,
                token: action.token
            };
        case ActionTypes.LOAD_ACCOUNT_DETAILS_SUCCESS:
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
        case ActionTypes.LOAD_ACCOUNT_DETAILS_FAILURE:
            return {
                ...state,
                isInvalidated: true,
                isLoadingData: false
            };
        case ActionTypes.UPDATE_ACCOUNT_DISPLAY_NAME:
            return {
                ...state,
                isUpdatingData: true
            };
        case ActionTypes.UPDATE_ACCOUNT_DISPLAY_NAME_SUCCESS:
            return {
                ...state,
                isUpdatingData: false,
                isAutoSetup: false,
                displayName: action.displayName
            };
        case ActionTypes.UPDATE_ACCOUNT_DISPLAY_NAME_FAILURE:
            return {
                ...state,
                isUpdatingData: false
            };
        default:
            return state;
    }
}