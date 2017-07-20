interface AuthenticationState {
    isLoggingInOrOut: boolean;
    isRequestingAuthenticationToken: boolean;
    isWaitingForEmailConfirmation: boolean;
    token?: number;
    isAuthenticated?: boolean;
    returnUrl?: string;
    dispatch?: Function;
    router?: any;
}

export default AuthenticationState;