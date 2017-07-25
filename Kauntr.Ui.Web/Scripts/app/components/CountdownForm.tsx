import * as React from "react";

import CountdownType from "../constants/CountdownType";
import DurationType from "../constants/DurationType";

import CountdownFormDate from "./CountdownFormDate";
import CountdownFormDuration from "./CountdownFormDuration";

interface CountdownFormState {
    description: string;
    countdownType: CountdownType;
    duration?: number;
    durationType?: DurationType;
    day?: number;
    month?: number;
    year?: number;
    hour?: number;
    minute?: number;
    isValidDuration?: boolean;
    isValidDate?: boolean;
    isValid?: boolean;
}

export default class CountdownForm extends React.Component<any, CountdownFormState> {
    constructor() {
        super();

        this.state = {
            description: "",
            countdownType: CountdownType.Date,
            duration: null,
            isValid: false
        };
    }

    validateForm(): void {
        const { description, countdownType, isValidDate, isValidDuration } = this.state;
        this.setState({
            isValid: description.length > 2 && ((countdownType === CountdownType.Date && isValidDate) || (countdownType === CountdownType.Duration && isValidDuration))
        });
    }

    private handleCountdownTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        this.setState({
            countdownType: parseInt(e.target.value, 10),
            duration: null,
            durationType: null,
            day: null,
            month: null,
            year: null,
            hour: null,
            minute: null,
            isValid: false
        });
    }

    private handleDurationChange = (duration: number, durationType: DurationType, isValidDuration: boolean) => {
        this.setState({
            duration,
            durationType,
            isValidDuration
        }, this.validateForm);
    }

    private handleDateChange = (day: number, month: number, year: number, hour: number, minute: number, isValidDate: boolean) => {
        this.setState({
            day,
            month,
            year,
            hour,
            minute,
            isValidDate
        }, this.validateForm);
    }

    private handleDescriptionInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        e.preventDefault();

        this.setState({
            description: e.target.value
        }, this.validateForm);
    }

    private handleFormSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        if (this.state.isValid) {
            console.log("Submitting the form - hook to parent");
        }
    }

    renderSubSection() {
        return this.state.countdownType === CountdownType.Duration
            ? <CountdownFormDuration onChange={this.handleDurationChange} duration={this.state.duration} durationType={this.state.durationType} />
            : <CountdownFormDate onChange={this.handleDateChange} day={this.state.day} month={this.state.month} year={this.state.year} hour={this.state.hour} minute={this.state.minute} />;
    }

    render() {
        return (
            <form className="form-section countdown-form" onSubmit={this.handleFormSubmit}>
                <h4>what is happening?</h4>
                <div>
                    <input type="text" className="input input-medium" value={this.state.description} onChange={this.handleDescriptionInputChange} placeholder="describe the event" maxLength={50} autoComplete={"off"} />
                </div>
                <h4>when?</h4>
                <select className="input input-medium form-countdown-type" value={this.state.countdownType} onChange={this.handleCountdownTypeChange}>
                    <option value={CountdownType.Duration}>duration</option>
                    <option value={CountdownType.Date}>date</option>
                </select>
                {this.renderSubSection()}
                <p>oh, and ... it has to be at least 5 mins in the future!</p>
                <div>
                    <button type="submit" className="button button-medium" disabled={!this.state.isValid}>Start</button>
                </div>
            </form>
        );
    }
}