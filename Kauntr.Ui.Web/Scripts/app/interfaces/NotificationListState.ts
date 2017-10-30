import NotificationState from "./NotificationState";

interface NotificationListState {
    isLoadingData: boolean;
    notifications: Array<NotificationState>; // TODO - Add a notification state
    total: number;
    page: number;
    token?: number;
    dispatch?: Function;
    router?: any;
}

export default NotificationListState;