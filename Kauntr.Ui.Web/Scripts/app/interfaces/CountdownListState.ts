import CountdownDisplayOrderType from "../interfaces/CountdownDisplayOrderType";

import CountdownState from "./CountdownState";

interface CountdownListState {
    isLoadingData: boolean;
    countdowns: Array<CountdownState>;
    total: number;
    page: number;
    displayOrderType: CountdownDisplayOrderType;
    token?: number;
}

export default CountdownListState;