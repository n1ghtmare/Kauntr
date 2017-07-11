import {
    AUTHENTICATE,
    AUTHENTICATE_SUCCESS,
    AUTHENTICATE_FAILURE
} from "../constants/ActionTypes";

export function authenticateUser(accountId: number, authenticationToken: string, returnUrl: string, router: any) {
    return (dispatch: Function, getState: Function) => {
        const fetchUrl: string = "/account/authenticate";

        dispatch(authenticate());
        return fetch(fetchUrl, { method: "post", body: JSON.stringify({ AccountId: accountId, AuthenticationToken: authenticationToken }), headers: { "Content-Type": "application/json" } })
            .then(response => {
                if (!response.ok) {
                    throw response.status.toString();
                }
                return response;
            })
            .then(() => {
                dispatch(authenticateSuccess());
                router.push(typeof returnUrl !== "undefined" ? returnUrl : "/");
            })
            .catch(errorMessage => dispatch(authenticateFailure(errorMessage)));
    };
}

function authenticate() {
    return {
        type: AUTHENTICATE
    };
}

function authenticateSuccess() {
    return {
        type: AUTHENTICATE_SUCCESS
    };
}

function authenticateFailure(error: string) {
    return {
        type: AUTHENTICATE_FAILURE,
        error
    };
}