import * as React from "react";
import * as classNames from "classnames";

type AccountSettingsSubmitFunc = (displayName: string) => void;

interface AccountSettingsFormProps {
    isAutoSetup: boolean;
    displayName: string;
    onSubmit: AccountSettingsSubmitFunc;
}

interface AccountSettingsFormState {
    displayName: string;
    isValid: boolean;
}

export default class AccountSettingsForm extends React.Component<AccountSettingsFormProps, AccountSettingsFormState> {
    constructor(props: AccountSettingsFormProps) {
        super(props);

        this.state = {
            displayName: props.displayName,
            isValid: false
        };
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
            this.props.onSubmit(this.state.displayName);
        }
    }

    render() {
        return (
            <form className="form-section" onSubmit={this.handleFormSubmit}>
                <div><label htmlFor="displayName">display name</label></div>
                <div className={classNames({ "hidden": !this.props.isAutoSetup })}>
                    (your display name was auto-setup by the system, you might want to change it ... or not, it's cool)
                </div>
                <div>
                    <input type="text" className="input input-medium" id="displayName" placeholder="display name" value={this.state.displayName} onChange={this.handleDisplayNameInputChange} maxLength={25} autoComplete={"off"} />
                </div>
                <div>
                    <button type="submit" className="button button-medium" disabled={!this.state.isValid}>Update</button>
                </div>
            </form>
        );
    }
}