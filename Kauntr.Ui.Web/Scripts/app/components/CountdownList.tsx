import * as React from "react";
import { connect } from "react-redux";

import {
    pluralizeNaive
} from "../helpers/StringHelpers";

import {
    updateSharedContextTitle
} from "../actions/SharedContextActions";

import {
    fetchCountdownsIfNeeded
} from "../actions/CountdownActions";

import AppState from "../interfaces/AppState";
import CountdownListState from "../interfaces/CountdownListState";

import Countdown from "./Countdown";
import Pagination from "./Pagination";
import LoadingIndicator from "./LoadingIndicator";

interface CountdownListStateExtended extends CountdownListState {
    isAuthenticated?: boolean;
}

export class CountdownList extends React.Component<CountdownListStateExtended, any> {
    componentDidMount() {
        const { dispatch, displayOrderType } = this.props;

        dispatch(updateSharedContextTitle("countdowns")); // TODO - make this fancier
        dispatch(fetchCountdownsIfNeeded(1, displayOrderType));
    }

    private handleCountdownListPageChange = (page: number): void => {
        const { dispatch, displayOrderType } = this.props;
        dispatch(fetchCountdownsIfNeeded(page, displayOrderType));
    }

    renderList() {
        const { total } = this.props;
        const countdowns = this.props.countdowns.map(x =>
            <Countdown {...x} key={x.id} />
        );

        return (
            <div className="animated fadeIn">
                <div className="row">
                    <h3>{total} {pluralizeNaive(total, "countdown")}</h3>
                    <div className="countdowns">
                        {countdowns}
                    </div>
                    <Pagination page={this.props.page} pageSize={10} itemsTotalCount={total} onPageChange={this.handleCountdownListPageChange} />
                </div>
            </div>
        );
    }

    render() {
        const { isLoadingData } = this.props;
        return isLoadingData
            ? <LoadingIndicator isActive={isLoadingData} />
            : this.renderList();

    }
}

function mapStateToProps(state: AppState, ownProps: any): CountdownListStateExtended {
    return {
        isAuthenticated: state.sharedContext.currentUserAccountId !== null,
        ...state.countdownList
    };
}

export default connect(mapStateToProps)(CountdownList);