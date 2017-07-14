import * as moment from "moment";

interface PersonalAccountState {
    isLoadingData: boolean;
    isInvalidated: boolean;
    id?: number;
    displayName?: string;
    email?: string;
    reputation?: number;
    createdOn?: moment.Moment;
    isAutoSetup?: boolean;
    token?: number;
    error?: string;

    // TODO - add stats here (number of countdowns created? reputation changes? comments count? etc.)

    dispatch?: Function;
    router?: any;
}

export default PersonalAccountState;