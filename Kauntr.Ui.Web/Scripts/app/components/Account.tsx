import * as React from "react";
import { connect } from "react-redux";

import {
    updateSharedContextTitle
} from "../actions/SharedContextActions";

import {
    invalidatePersonalAccount,
    fetchPersonalAccountIfNeeded
} from "../actions/PersonalAccountActions";

import AppState from "../interfaces/AppState";
import PersonalAccountState from "../interfaces/PersonalAccountState";

export class Account extends React.Component<any, any> {
    componentDidMount() {
        const { dispatch } = this.props;

        dispatch(updateSharedContextTitle("account"));

        dispatch(invalidatePersonalAccount());
        dispatch(fetchPersonalAccountIfNeeded());
    }

    render() {
        return (
            <h1>Account (Personal)</h1>
        );
    }
}

function mapStateToProps(state: AppState, ownProps: any): PersonalAccountState {
    return state.personalAccount;
}

export default connect(mapStateToProps)(Account);