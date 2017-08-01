import * as React from "react";
import { connect } from "react-redux";

import {
    updateSharedContextTitle
} from "../actions/SharedContextActions";

import {
    fetchCountdownIfNeeded
} from "../actions/CountdownActions";

import AppState from "../interfaces/AppState";
import CountdownState from "../interfaces/CountdownState";

import Countdown from "./Countdown";
import LoadingIndicator from "./LoadingIndicator";

export class CountdownDetails extends React.Component<CountdownState, any> {
    componentDidMount() {
        const { dispatch, router } = this.props;
        dispatch(updateSharedContextTitle("countdown"));

        // TODO - Decide if comments should load simultaniously or after the
        dispatch(fetchCountdownIfNeeded(router.params.id))
            .then(() => console.log("Will now load comments, should they be separated?"));
    }

    renderCountdown() {
        return (
            <div className="animated fadeIn">
                <div className="row">
                    <Countdown {...this.props} />
                </div>
            </div>
        );
    }

    render() {
        const { isLoadingData } = this.props;
        return isLoadingData
            ? <LoadingIndicator isActive={isLoadingData} />
            : this.renderCountdown();
    }
}

function mapStateToProps(state: AppState, ownProps: any): CountdownState {
    return {
        ...state.countdown,
        voteScore: -5
    };
}

export default connect(mapStateToProps)(CountdownDetails);