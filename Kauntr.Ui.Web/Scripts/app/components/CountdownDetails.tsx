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

export class CountdownDetails extends React.Component<CountdownState, any> {
    componentDidMount() {
        const { dispatch, router } = this.props;
        dispatch(updateSharedContextTitle("countdown"));

        // TODO - Figure out why dispatching is not in the correct order (SharedContext should finish before doing any of this here)
        // dispatch(fetchCountdownIfNeeded(router.params.id));
    }

    render() {
        return (
            <div className="animated fadeIn">
                <div className="row">
                    <h3>countdown details </h3>
                    <Countdown />
                </div>
            </div>
        );
    }
}

function mapStateToProps(state: AppState, ownProps: any): CountdownState {
    return state.countdown;
}

export default connect(mapStateToProps)(CountdownDetails);