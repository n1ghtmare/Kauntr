import SharedContextState from "./SharedContextState";
import AuthenticationState from "./AuthenticationState";
import AccountState from "./AccountState";
import ErrorState from "./ErrorState";

interface AppState {
    sharedContext: SharedContextState;
    authentication: AuthenticationState;
    accountDetails: AccountState;
    error: ErrorState;
};

export default AppState;