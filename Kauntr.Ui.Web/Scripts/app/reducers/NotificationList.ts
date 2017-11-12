import NotificationListState from "../interfaces/NotificationListState";
import NotificationState from "../interfaces/NotificationState";

import { parseRawDate } from "../helpers/DateHelpers";

import * as ActionTypes from "../constants/ActionTypes";

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
        case ActionTypes.LOAD_NOTIFICATIONS:
            return {
                ...state,
                isLoadingData: true,
                token: action.token
            };
        case ActionTypes.LOAD_NOTIFICATIONS_SUCCESS:
            return {
                ...state,
                isLoadingData: false,
                token: null,
                page: parseInt(action.json.Page, 10),
                total: parseInt(action.json.Total, 10),
                notifications: parseNotifications(action.json.Notifications)
            };
        case ActionTypes.LOAD_NOTIFICATIONS_FAILURE:
            return initialState;
        case ActionTypes.DISMISS_NOTIFICATIONS_ALL:
            return {
                ...state,
                isLoadingData: true
            };
        case ActionTypes.DISMISS_NOTIFICATIONS_ALL_SUCCESS:
        case ActionTypes.DISMISS_NOTIFICATIONS_ALL_FAILURE:
            return initialState;
        default:
            return state;
    }
}

function parseNotifications(notifications: Array<any>): Array<NotificationState> {
    return notifications.map(x => ({
        id: parseInt(x.Id, 10),
        commentId: x.CommentId !== null ? parseInt(x.CommentId, 10) : null,
        countdownId: x.CountdownId !== null ? parseInt(x.CountdownId, 10) : null,
        ownedByAccountId: parseInt(x.OwnedByAccountId, 10),
        lastChangedOn: parseRawDate(x.LastChangedOn),
        commentContent: x.CommentContent,
        countdownContent: x.CountdownContent,
        commentActions: x.CommentActions,
        downvoteActions: x.DownvoteActions,
        upvoteActions: x.UpvoteActions
    }) as NotificationState);
}