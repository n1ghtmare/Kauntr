import SharedContextState from "./SharedContextState";
import AuthenticationState from "./AuthenticationState";
import AccountState from "./AccountState";
import ErrorState from "./ErrorState";
import CountdownState from "./CountdownState";
import CountdownListState from "./CountdownListState";

interface AppState {
    sharedContext: SharedContextState;
    authentication: AuthenticationState;
    account: AccountState;
    countdown: CountdownState;
    countdownList: CountdownListState;
    error: ErrorState;
}

export default AppState;