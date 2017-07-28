import CountdownState from "../interfaces/CountdownState";

import * as ActionTypes from "../constants/ActionTypes";

interface CountdownAction {
    type: string;
}

export const initialState: CountdownState = {
    isCreatingNew: false
};

export default function countdown(state = initialState, action: CountdownAction): CountdownState {
    switch (action.type) {
        case ActionTypes.CREATE_COUNTDOWN:
            return {
                ...state,
                isCreatingNew: true
            };
        case ActionTypes.CREATE_COUNTDOWN_SUCCESS:
        case ActionTypes.CREATE_COUNTDOWN_FAILURE:
            return {
                ...state,
                isCreatingNew: false
            };
        default:
            return state;
    }
}