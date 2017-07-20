interface ErrorState {
    code: number;
    error: string;
    subError?: string;
    dispatch?: Function;
    router?: any;
}

export default ErrorState;