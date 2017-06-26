interface AccountState {
    isAuthenticated: boolean;
    userId?: number;
    nickname?: string;
}

export const initialState: AccountState = {
    isAuthenticated: false
};

export default function user(state = initialState, action: any) {
    switch(action.type) {
        default:
            return state;
    }
}
