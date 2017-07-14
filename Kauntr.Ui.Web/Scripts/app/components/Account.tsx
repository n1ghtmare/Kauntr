import * as React from "react";
import { connect } from "react-redux";
import * as classNames from "classnames";

import {
    updateSharedContextTitle
} from "../actions/SharedContextActions";

import {
    invalidatePersonalAccount,
    fetchPersonalAccountIfNeeded
} from "../actions/PersonalAccountActions";

import AppState from "../interfaces/AppState";
import PersonalAccountState from "../interfaces/PersonalAccountState";

import LoadingIndicator from "./LoadingIndicator";

interface AccountFormState {
    displayName: string;
    isValid: boolean;
};

export class Account extends React.Component<PersonalAccountState, AccountFormState> {
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

    componentWillReceiveProps(nextProps: PersonalAccountState) {
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
        const { createdOn } = this.props;
        return (
            <div className="main-section animated fadeIn">
                <h1 className="main-section-header">Account (Personal)</h1>
                <ul className="user-details-list">
                    <li>email - {this.props.email}</li>
                    <li>joined - {typeof createdOn !== "undefined" ? createdOn.fromNow() : "-"}</li>
                    <li>reputation - {this.props.reputation}</li>
                </ul>
                <div className="diamonds">&#9830; &#9830; &#9830;</div>
                <form className="form-section" onSubmit={this.handleFormSubmit}>
                    <div><label htmlFor="displayName">display name</label></div>
                    <div className={classNames("text-small", { "hidden": !this.props.isAutoSetup })}>
                        (your display name was auto-setup by the system, you might want to change it?)
                    </div>
                    <div>
                        <input type="text" className="text-main" id="displayName" placeholder="display name" value={this.state.displayName} onChange={this.handleDisplayNameInputChange} maxLength={25} />
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

function mapStateToProps(state: AppState, ownProps: any): PersonalAccountState {
    return state.personalAccount;
}

export default connect(mapStateToProps)(Account);