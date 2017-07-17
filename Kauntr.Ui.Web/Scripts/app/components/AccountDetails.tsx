import * as React from "react";
import { connect } from "react-redux";

import {
    updateSharedContextTitle
} from "../actions/SharedContextActions";

import {
    invalidatePersonalAccount,
    fetchAccountDetailsIfNeeded,
    updateAccountDisplayNameIfNeeded
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

    private handleOnDisplayNameUpdate = (displayName: string): void => {
        this.props.dispatch(updateAccountDisplayNameIfNeeded(displayName));
    }

    renderAccountDetails() {
        const { createdOn, isPersonalAccount, displayName } = this.props;
        return (
            <div className="animated fadeIn">
                <div className="row">
                    <h3>Account Details</h3>
                    <h4>{isPersonalAccount ? "personal" : displayName}</h4>
                    <ul>
                        <li>email - {isPersonalAccount ? this.props.email : "?"}</li>
                        <li>joined - {typeof createdOn !== "undefined" ? createdOn.fromNow() : "-"}</li>
                        <li>reputation - {this.props.reputation}</li>
                    </ul>
                    <DiamondsSeparator />
                    {isPersonalAccount
                        ? <AccountSettingsForm isAutoSetup={this.props.isAutoSetup} displayName={displayName} onSubmit={this.handleOnDisplayNameUpdate} isActive={this.props.isUpdatingData || this.props.isLoadingData} />
                        : null}
                </div>
            </div>
        );
    }

    render() {
        const { isLoadingData } = this.props;
        return isLoadingData
            ? <LoadingIndicator isActive={isLoadingData} />
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