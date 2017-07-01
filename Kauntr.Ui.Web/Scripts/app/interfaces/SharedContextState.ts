interface SharedContextState {
    isLoadingData: boolean;
    isInvalidated: boolean;
    currentUserId?: number;
    notificationsCount?: number;
    title?: string;
    returnUrl?: string;
    dispatch?: Function;
    router?: any;
}

export default SharedContextState;