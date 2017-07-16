interface AuthenticationState {
    isLoggingInOrOut: boolean;
    isRequestingAuthenticationToken: boolean;
    isWaitingForEmailConfirmation: boolean;
    token?: number;
    isAuthenticated?: boolean;
    returnUrl?: string;
    error?: string;
    dispatch?: Function;
    router?: any;
}

export default AuthenticationState;