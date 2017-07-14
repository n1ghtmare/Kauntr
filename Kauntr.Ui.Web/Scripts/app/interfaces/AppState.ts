import SharedContextState from "./SharedContextState";
import LoginState from "./LoginState";
import AuthenticatorState from "./AuthenticatorState";
import AccountState from "./AccountState";

interface AppState {
    sharedContext: SharedContextState;
    login: LoginState;
    authenticator: AuthenticatorState;
    accountDetails: AccountState;
};

export default AppState;