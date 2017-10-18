import * as React from "react";
import { connect } from "react-redux";

import {
    updateSharedContextTitle
} from "../actions/SharedContextActions";

import {
    createCountdownFromDuration,
    createCountdownFromDateSegments
} from "../actions/CountdownActions";

import DurationType from "../constants/DurationType";
import AppState from "../interfaces/AppState";
import CountdownState from "../interfaces/CountdownState";

import CountdownForm from "./CountdownForm";

export class CountdownCreate extends React.Component<CountdownState, any> {
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(updateSharedContextTitle("create"));
    }

    private handleOnSubmitDuration = (description: string, durationType: DurationType, duration: number) => {
        const { dispatch } = this.props;
        dispatch(createCountdownFromDuration(description, durationType, duration));
    }

    private handleOnSubmitDateSegments = (description: string, endsOnDay: number, endsOnMonth: number, endsOnYear: number, endsOnHour?: number, endsOnMinute?: number) => {
        const { dispatch } = this.props;
        dispatch(createCountdownFromDateSegments(description, endsOnDay, endsOnMonth, endsOnYear, endsOnHour, endsOnMinute));
    }

    render() {
        return (
            <div className="animated fadeIn">
                <div className="row">
                    <h3>create a new countdown</h3>
                    <CountdownForm onSubmitDateSegments={this.handleOnSubmitDateSegments} onSubmitDuration={this.handleOnSubmitDuration} />
                </div>
            </div>
        );
    }
}

function mapStateToProps(state: AppState, ownProps: any): CountdownState {
    return state.countdown;
}

export default connect(mapStateToProps, null)(CountdownCreate);
