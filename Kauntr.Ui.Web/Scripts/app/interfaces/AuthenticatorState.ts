interface AuthenticatorState {
    isLoadingData: boolean;
    error?: string;
    dispatch?: Function;
    router?: any;
}

export default AuthenticatorState;