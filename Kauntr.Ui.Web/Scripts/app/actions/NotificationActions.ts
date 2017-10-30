import * as moment from "moment";

import { handleServerError } from "./ErrorActions";

import AppState from "../interfaces/AppState";

import * as ActionTypes from "../constants/ActionTypes";

export function fetchNotificationsIfNeeded(page: number) {
    return async (dispatch: Function, getState: Function) => {
        if (shouldFetchNotifications(getState())) {
            const token: number = moment().unix();
            dispatch(loadNotifications(token));

            const response: Response = await fetch(`/notification/index?Page=${page}}&Token=${token}`);
            if (response.ok) {
                const json = await response.json();
                if (shouldProcessNotifications(getState(), json.Token)) {
                    dispatch(loadNotificationsSuccess(json));
                }
            }
            else {
                handleServerError(response, dispatch, loadNotifications);
            }
        }
    };
}

function shouldFetchNotifications(state: AppState): boolean {
    return !state.notificationList.isLoadingData;
}

function shouldProcessNotifications(state: AppState, token: number): boolean {
    return state.notificationList.token === token;
}

function loadNotifications(token: number) {
    return {
        type: ActionTypes.LOAD_NOTIFICATIONS,
        token
    };
}

function loadNotificationsSuccess(json: any) {
    return {
        type: ActionTypes.LOAD_NOTIFICATIONS_SUCCESS,
        json
    };
}

function loadNotificationsFailure() {
    return {
        type: ActionTypes.LOAD_NOTIFICATIONS_FAILURE
    };
}