interface SharedContextState {
    isLoadingData: boolean;
    isInvalidated: boolean;
    currentUserId?: number;
    notificationsCount?: number;
    title?: string;
    token?: number;
    returnUrl?: string;
    dispatch?: Function;
    router?: any;
}

export default SharedContextState;