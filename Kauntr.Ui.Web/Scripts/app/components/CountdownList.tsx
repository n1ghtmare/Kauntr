import * as React from "react";
import { connect } from "react-redux";

import {
    updateSharedContextTitle
} from "../actions/SharedContextActions";

import {
    fetchCountdownsIfNeeded
} from "../actions/CountdownActions";

import AppState from "../interfaces/AppState";
import CountdownListState from "../interfaces/CountdownListState";

interface CountdownListStateExtended extends CountdownListState {
    isAuthenticated?: boolean;
}

export class CountdownList extends React.Component<CountdownListStateExtended, any> {
    componentDidMount() {
        const { dispatch, displayOrderType } = this.props;
        const { params } = this.props.router;

        dispatch(updateSharedContextTitle("countdowns")); // TODO - make this fancier
        dispatch(fetchCountdownsIfNeeded(1, displayOrderType));
    }

    render() {
        return (
            <div className="animated fadeIn">
                <div className="row">
                    <h3>countdowns / trending</h3>
                    <h4>{this.props.total}</h4>
                    <div>
                        countdown list here ...
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state: AppState, ownProps: any): CountdownListStateExtended {
    return {
        isAuthenticated: state.sharedContext.currentUserAccountId !== null,
        ...state.countdownList
    };
}

export default connect(mapStateToProps)(CountdownList);