import * as moment from "moment";
import { hashHistory } from "react-router";

import { handleServerError } from "./ErrorActions";

import AppState from "../interfaces/AppState";
import CountdownDisplayOrderType from "../interfaces/CountdownDisplayOrderType";

import * as ActionTypes from "../constants/ActionTypes";

import CountdownType from "../constants/CountdownType";
import DurationType from "../constants/DurationType";

export function createCountdownFromDuration(description: string, durationType: DurationType, duration: number) {
    return createCountdownFromData(JSON.stringify({
        Description: description,
        SelectedCountdownType: CountdownType.Duration,
        SelectedDurationType: durationType,
        Duration: duration
    }));
}

export function createCountdownFromDateSegments(description: string, endsOnDay: number, endsOnMonth: number, endsOnYear: number, endsOnHour?: number, endsOnMinute?: number) {
    return createCountdownFromData(JSON.stringify({
        Description: description,
        SelectedCountdownType: CountdownType.Date,
        EndsOnDay: endsOnDay,
        EndsOnMonth: endsOnMonth,
        EndsOnYear: endsOnYear,
        EndsOnHour: endsOnHour,
        EndsOnMinute: endsOnMinute
    }));
}

function createCountdownFromData(data: string) {
    return (dispatch: Function, getState: Function): Promise<void> => {
        if (shouldCreateCountdown(getState())) {
            dispatch(createCountdown());

            return fetch("/countdown/create", { method: "post", body: data, headers: new Headers({ "Content-Type": "application/json" }) })
                .then(response => {
                    if (!response.ok) {
                        throw response;
                    }
                    return response.json();
                })
                .then(json => {
                    dispatch(createCountdownSuccess());
                    hashHistory.push(`/countdown/${json.Id}`);
                })
                .catch((response: Response) => handleServerError(response, dispatch, createCountdownFailure));
        }
    };
}

function shouldCreateCountdown(state: AppState) {
    return !state.countdown.isCreatingNew;
}

function createCountdown() {
    return {
        type: ActionTypes.CREATE_COUNTDOWN
    };
}

function createCountdownSuccess() {
    return {
        type: ActionTypes.CREATE_COUNTDOWN_SUCCESS
    };
}

function createCountdownFailure() {
    return {
        type: ActionTypes.CREATE_COUNTDOWN_FAILURE
    };
}

export function fetchCountdownDetailsIfNeeded(countdownId: number) {
    return (dispatch: Function, getState: Function): Promise<void> => {
        if (shouldFetchCountdownDetails(getState())) {
            dispatch(loadCountdownDetails());

            return fetch(`/countdown/details?countdownId=${countdownId}`)
                .then(response => {
                    if (!response.ok) {
                        throw response;
                    }
                    return response.json();
                })
                .then(json => dispatch(loadCountdownDetailsSuccess(json)))
                .catch((response: Response) => handleServerError(response, dispatch, loadCountdownDetailsFailure));
        }
    };
}

function shouldFetchCountdownDetails(state: AppState): boolean {
    return !state.countdown.isLoadingData;
}

function loadCountdownDetails() {
    return {
        type: ActionTypes.LOAD_COUNTDOWN_DETAILS
    };
}

function loadCountdownDetailsSuccess(json: any) {
    return {
        type: ActionTypes.LOAD_COUNTDOWN_DETAILS_SUCCESS,
        json
    };
}

function loadCountdownDetailsFailure() {
    return {
        type: ActionTypes.LOAD_COUNTDOWN_DETAILS_FAILURE
    };
}

export function fetchCountdownsIfNeeded(page: number, displayOrderType: CountdownDisplayOrderType, query: string, isCurrentlyActive: boolean, isCreatedByCurrentUser: boolean) {
    return (dispatch: Function, getState: Function): Promise<void> => {
        if (shouldFetchCountdowns(getState())) {
            const token: number = moment().unix();

            dispatch(loadCountdowns(token));

            return fetch(`/countdown/index?Page=${page}&DisplayOrderType=${displayOrderType}&Filter.Query=${query === null ? "" : query}&Filter.IsCurrentlyActive=${isCurrentlyActive}&Filter.IsCreatedByCurrentUser=${isCreatedByCurrentUser}&Token=${token}`)
                .then(response => {
                    if (!response.ok) {
                        throw response;
                    }
                    return response.json();
                })
                .then(json => {
                    if (shouldProcessCountdowns(getState(), json.Token)) {
                        dispatch(loadCountdownsSuccess(json));
                    }
                })
                .catch((response: Response) => handleServerError(response, dispatch, loadCountdownsFailure));
        }
    };
}

function shouldProcessCountdowns(state: AppState, token: number): boolean {
    return state.countdownList.token === token;
}

function shouldFetchCountdowns(state: AppState): boolean {
    return !state.countdownList.isLoadingData;
}

function loadCountdowns(token: number) {
    return {
        type: ActionTypes.LOAD_COUNTDOWNS,
        token
    };
}

function loadCountdownsSuccess(json: any) {
    return {
        type: ActionTypes.LOAD_COUNTDOWNS_SUCCESS,
        json
    };
}

function loadCountdownsFailure() {
    return {
        type: ActionTypes.LOAD_COUNTDOWNS_FAILURE
    };
}

export function toggleFilterMode() {
    return {
        type: ActionTypes.TOGGLE_FILTER_MODE
    };
}