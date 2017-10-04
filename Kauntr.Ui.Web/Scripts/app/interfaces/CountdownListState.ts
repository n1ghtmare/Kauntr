import CountdownDisplayOrderType from "../interfaces/CountdownDisplayOrderType";

import CountdownState from "./CountdownState";

interface CountdownListState {
    isLoadingData: boolean;
    isInFilterMode: boolean;
    countdowns: Array<CountdownState>;
    total: number;
    page: number;
    displayOrderType: CountdownDisplayOrderType;
    token?: number;
    dispatch?: Function;
    router?: any;
}

export default CountdownListState;