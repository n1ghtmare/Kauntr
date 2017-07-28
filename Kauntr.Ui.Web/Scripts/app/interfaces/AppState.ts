import SharedContextState from "./SharedContextState";
import AuthenticationState from "./AuthenticationState";
import AccountState from "./AccountState";
import ErrorState from "./ErrorState";
import CountdownState from "./CountdownState";

interface AppState {
    sharedContext: SharedContextState;
    authentication: AuthenticationState;
    account: AccountState;
    countdown: CountdownState;
    error: ErrorState;
};

export default AppState;