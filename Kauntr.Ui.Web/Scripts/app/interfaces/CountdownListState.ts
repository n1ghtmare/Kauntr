import CountdownDisplayOrderType from "../interfaces/CountdownDisplayOrderType";

import CountdownState from "./CountdownState";
import CountdownListFilterState from "./CountdownListFilterState";

interface CountdownListState {
    isLoadingData: boolean;
    isInFilterMode: boolean;
    countdowns: Array<CountdownState>;
    total: number;
    page: number;
    displayOrderType: CountdownDisplayOrderType;
    filters: CountdownListFilterState;
    totalCreationsFromServer: number;
    token?: number;
    dispatch?: Function;
    router?: any;
}

export default CountdownListState;