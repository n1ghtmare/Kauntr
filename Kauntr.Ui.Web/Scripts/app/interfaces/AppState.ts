import SharedContextState from "./SharedContextState";
import AuthenticationState from "./AuthenticationState";
import AccountState from "./AccountState";
import ErrorState from "./ErrorState";
import CountdownState from "./CountdownState";
import CountdownListState from "./CountdownListState";
import NotificationListState from "./NotificationListState";

interface AppState {
    sharedContext: SharedContextState;
    authentication: AuthenticationState;
    account: AccountState;
    countdown: CountdownState;
    countdownList: CountdownListState;
    notificationList: NotificationListState;
    error: ErrorState;
}

export default AppState;