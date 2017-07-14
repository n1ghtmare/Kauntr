import * as React from "react";
import { connect } from "react-redux";
import * as classNames from "classnames";

import {
    updateSharedContextTitle
} from "../actions/SharedContextActions";

import {
    invalidatePersonalAccount,
    fetchPersonalAccountIfNeeded
} from "../actions/AccountActions";

import AppState from "../interfaces/AppState";
import AccountState from "../interfaces/AccountState";

import LoadingIndicator from "./LoadingIndicator";
import AccountDetailsList from "./AccountDetailsList";
import DiamondsSeparator from "./DiamondsSeparator";

interface AccountFormState {
    displayName: string;
    isValid: boolean;
};

export class Account extends React.Component<AccountState, AccountFormState> {
    constructor() {
        super();
        this.state = {
            displayName: "",
            isValid: false
        };
    }

    componentDidMount() {
        const { dispatch } = this.props;

        dispatch(updateSharedContextTitle("account"));

        dispatch(invalidatePersonalAccount());
        dispatch(fetchPersonalAccountIfNeeded());
    }

    componentWillReceiveProps(nextProps: AccountState) {
        this.setState({
            displayName: nextProps.displayName
        });
    }

    validateForm(): void {
        const { displayName } = this.state;
        this.setState({
            isValid: displayName.length > 1 && displayName !== this.props.displayName
        });
    }

    private handleDisplayNameInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        e.preventDefault();

        this.setState({
            displayName: e.target.value
        }, () => this.validateForm());
    }

    private handleFormSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        if (this.state.isValid) {
            console.log("WILL UPDATE YOUR DISPLAY NAME TO - " + this.state.displayName);
        }
    }

    renderAccountDetails() {
        return (
            <div className="main-section animated fadeIn">
                <h1 className="main-section-header">Account (personal)</h1>
                <AccountDetailsList createdOn={this.props.createdOn} email={this.props.email} reputation={this.props.reputation} />
                <DiamondsSeparator />
                <form className="form-section" onSubmit={this.handleFormSubmit}>
                    <div><label htmlFor="displayName">display name</label></div>
                    <div className={classNames("text-small", { "hidden": !this.props.isAutoSetup })}>
                        (your display name was auto-setup by the system, you might want to change it ... or not, it's cool)
                    </div>
                    <div>
                        <input type="text" className="text-main" id="displayName" placeholder="display name" value={this.state.displayName} onChange={this.handleDisplayNameInputChange} maxLength={25} autoComplete={"off"} />
                    </div>
                    <div>
                        <button type="submit" className="button button-main" disabled={!this.state.isValid}>Update</button>
                    </div>
                </form>
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
    return state.personalAccount;
}

export default connect(mapStateToProps)(Account);