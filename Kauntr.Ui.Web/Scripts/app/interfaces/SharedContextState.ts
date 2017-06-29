interface SharedContextState {
    isLoadingData: boolean;
    isInvalidated: boolean;
    currentUserId?: number;
    notificationsCount?: number;
    dispatch?: Function;
}

export default SharedContextState;