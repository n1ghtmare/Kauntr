import NotificationListState from "../interfaces/NotificationListState";
import NotificationState from "../interfaces/NotificationState";

import { parseRawDate } from "../helpers/DateHelpers";

interface NotificationListAction {
    type: string;
    token?: number;
    json?: any;
}

export const initialState: NotificationListState = {
    isLoadingData: false,
    notifications: [],
    page: 1,
    total: 0,
    token: null
};

export default function notificationList(state = initialState, action: NotificationListAction): NotificationListState {
    switch (action.type) {
        default:
            return state;
    }
}