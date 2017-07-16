import SharedContextState from "./SharedContextState";
import AuthenticationState from "./AuthenticationState";
import AccountState from "./AccountState";

interface AppState {
    sharedContext: SharedContextState;
    authentication: AuthenticationState;
    accountDetails: AccountState;
};

export default AppState;