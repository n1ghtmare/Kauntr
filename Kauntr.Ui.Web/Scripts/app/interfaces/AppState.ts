import SharedContextState from "./SharedContextState";
import LoginState from "./LoginState";
import AuthenticatorState from "./AuthenticatorState";

interface AppState {
    sharedContext: SharedContextState;
    login: LoginState;
    authenticator: AuthenticatorState;
};

export default AppState;