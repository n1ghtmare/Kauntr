import { hashHistory } from "react-router";

import AppState from "../interfaces/AppState";

import * as ActionTypes from "../constants/ActionTypes";

import { handleServerError } from "./ErrorActions";

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

            return fetch("/countdown/create", { method: "post", body: data, headers: { "Content-Type": "application/json" } })
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

export function fetchCountdownIfNeeded(countdownId: number) {
    return (dispatch: Function, getState: Function): Promise<void> => {
        if (shouldFetchCountdown(getState())) {
            dispatch(loadCountdown());

            return fetch(`/countdown/details?countdownId=${countdownId}`)
                .then(response => {
                    if (!response.ok) {
                        throw response;
                    }
                    return response.json();
                })
                .then(json => dispatch(loadCountdownSuccess(json)))
                .catch((response: Response) => handleServerError(response, dispatch, loadCountdownFailure));
        }
    };
}

function shouldFetchCountdown(state: AppState): boolean {
    return !state.countdown.isLoadingData;
}

function loadCountdown() {
    return {
        type: ActionTypes.LOAD_COUNTDOWN
    };
}

function loadCountdownSuccess(json: any) {
    return {
        type: ActionTypes.LOAD_COUNTDOWN_SUCCESS,
        json
    };
}

function loadCountdownFailure() {
    return {
        type: ActionTypes.LOAD_COUNTDOWN_FAILURE
    };
}
