import SharedContextState from "./SharedContextState";
import LoginState from "./LoginState";

interface AppState {
    sharedContext: SharedContextState;
    login: LoginState;
};

export default AppState;