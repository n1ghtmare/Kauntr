interface LoginState {
    isLoadingData: boolean;
    isInvalidated: boolean;
    isWaitingForEmailConfirmation: boolean;
    isAuthenticated?: boolean;
    returnUrl?: string;
    error?: string;
    dispatch?: Function;
    router?: any;
}

export default LoginState;