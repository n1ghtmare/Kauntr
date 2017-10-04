import * as React from "react";
import { connect } from "react-redux";

import {
    updateSharedContextTitle
} from "../actions/SharedContextActions";

import {
    fetchCountdownsIfNeeded,
    toggleFilterMode
} from "../actions/CountdownActions";

import AppState from "../interfaces/AppState";
import CountdownListState from "../interfaces/CountdownListState";
import CountdownDisplayOrderType from "../interfaces/CountdownDisplayOrderType";

import Countdown from "./Countdown";
import CountdownOrderControls from "./CountdownOrderControls";
import CountdownFilterControls from "./CountdownFilterControls";
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

    private handlePageChange = (page: number): void => {
        const { dispatch, displayOrderType } = this.props;
        dispatch(fetchCountdownsIfNeeded(page, displayOrderType));
    }

    private handleDisplayOrderChange = (displayOrderType: CountdownDisplayOrderType): void => {
        // TODO - Have the display order changes be saved in the URL -> countdowns/latest/?page=1&q=test
        const { dispatch, page } = this.props;
        dispatch(fetchCountdownsIfNeeded(page, displayOrderType));
    }

    private handleFilterModeToggle = (): void => this.props.dispatch(toggleFilterMode());

    renderList() {
        const { total } = this.props;
        const countdowns = this.props.countdowns.map(x =>
            <Countdown {...x} key={x.id} />
        );

        return (
            <div className="animated fadeIn">
                <div className="row">
                    <CountdownFilterControls totalCount={total} onFilterModeToggle={this.handleFilterModeToggle} isInFilterMode={this.props.isInFilterMode} isAuthenticated={this.props.isAuthenticated} />
                    <CountdownOrderControls onChange={this.handleDisplayOrderChange} displayOrderType={this.props.displayOrderType} itemsTotalCount={total} />
                    <div className="countdowns">
                        {countdowns}
                    </div>
                    <Pagination page={this.props.page} pageSize={10} itemsTotalCount={total} onPageChange={this.handlePageChange} />
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