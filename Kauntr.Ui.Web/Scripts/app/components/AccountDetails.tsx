import * as React from "react";
import { connect } from "react-redux";

import {
    updateSharedContextTitle
} from "../actions/SharedContextActions";

import {
    invalidatePersonalAccount,
    fetchAccountDetailsIfNeeded
} from "../actions/AccountActions";

import AppState from "../interfaces/AppState";
import AccountState from "../interfaces/AccountState";

import LoadingIndicator from "./LoadingIndicator";
import DiamondsSeparator from "./DiamondsSeparator";
import AccountSettingsForm from "./AccountSettingsForm";

export class AccountDetails extends React.Component<AccountState, any> {
    componentDidMount() {
        const { dispatch, router } = this.props;
        const { id } = router.params;

        dispatch(updateSharedContextTitle("account"));

        dispatch(invalidatePersonalAccount());
        dispatch(fetchAccountDetailsIfNeeded(typeof id === "undefined" ? null : id));
    }

    renderAccountDetails() {
        const { createdOn, isPersonalAccount, displayName } = this.props;
        return (
            <div className="animated fadeIn">
                <h3>Account Details ({isPersonalAccount ? "personal" : displayName})</h3>
                <ul>
                    <li>email - {isPersonalAccount ? this.props.email : "?"}</li>
                    <li>joined - {typeof createdOn !== "undefined" ? createdOn.fromNow() : "-"}</li>
                    <li>reputation - {this.props.reputation}</li>
                </ul>
                <DiamondsSeparator />
                {isPersonalAccount
                    ? <AccountSettingsForm isAutoSetup={this.props.isAutoSetup} displayName={displayName} onSubmit={n => console.log(n)} />
                    : null}
            </div>
        );
    }

    render() {
        return this.props.isLoadingData
            ? <LoadingIndicator isActive={this.props.isLoadingData} />
            : this.renderAccountDetails();
    }
}

function mapStateToProps(state: AppState, ownProps: any): AccountState {
    return {
        ...state.accountDetails,
        isPersonalAccount: state.sharedContext.currentUserAccountId === state.accountDetails.id
    };
}

export default connect(mapStateToProps)(AccountDetails);