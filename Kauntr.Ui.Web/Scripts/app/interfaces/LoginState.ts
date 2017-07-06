interface LoginState {
    isLoadingData: boolean;
    isInvalidated: boolean;
    isWaitingForEmailConfirmation: boolean;
    error?: string;
    dispatch?: Function;
    router?: any;
}

export default LoginState;