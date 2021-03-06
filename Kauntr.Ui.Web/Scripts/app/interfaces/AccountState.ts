import * as moment from "moment";

interface AccountState {
    isLoadingData: boolean;
    isInvalidated: boolean;
    isUpdatingData: boolean;
    isPersonalAccount?: boolean;
    id?: number;
    displayName?: string;
    email?: string;
    reputation?: number;
    createdOn?: moment.Moment;
    isAutoSetup?: boolean;
    gravatarUrl?: string;
    token?: number;

    // TODO - add stats here (number of countdowns created? reputation changes? comments count? etc.)

    dispatch?: Function;
    router?: any;
}

export default AccountState;