import SharedContextState from "./SharedContextState";
import LoginState from "./LoginState";
import AuthenticatorState from "./AuthenticatorState";
import PersonalAccountState from "./PersonalAccountState";

interface AppState {
    sharedContext: SharedContextState;
    login: LoginState;
    authenticator: AuthenticatorState;
    personalAccount: PersonalAccountState;
};

export default AppState;