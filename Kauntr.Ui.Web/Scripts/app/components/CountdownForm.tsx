import * as React from "react";

import CountdownType from "../constants/CountdownType";
import DurationType from "../constants/DurationType";

import CountdownFormDate from "./CountdownFormDate";
import CountdownFormDuration from "./CountdownFormDuration";

interface CountdownFormState {
    countdownType: CountdownType;
    duration?: number;
    durationType?: DurationType;
    day?: number;
    month?: number;
    year?: number;
    hour?: number;
    minute?: number;
    isValidDate?: boolean;
}

export default class CountdownForm extends React.Component<any, CountdownFormState> {
    constructor() {
        super();

        this.state = {
            countdownType: CountdownType.Date,
            duration: null,
        };
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
            minute: null
        });
    }

    private handleDurationChange = (duration: number, durationType: DurationType) => {
        this.setState({
            duration,
            durationType
        });
    }

    private handleDateChange = (day: number, month: number, year: number, hour: number, minute: number, isValidDate: boolean) => {
        this.setState({
            day,
            month,
            year,
            hour,
            minute,
            isValidDate
        });
    }

    renderSubSection() {
        return this.state.countdownType === CountdownType.Duration
            ? <CountdownFormDuration onChange={this.handleDurationChange} duration={this.state.duration} durationType={this.state.durationType} />
            : <CountdownFormDate onChange={this.handleDateChange} day={this.state.day} month={this.state.month} year={this.state.year} hour={this.state.hour} minute={this.state.minute} />;
    }

    render() {
        return (
            <form className="form-section countdown-form">
                <h4>what is happening?</h4>
                <div>
                    <input type="text" className="input input-medium" placeholder="describe the event" maxLength={50} autoComplete={"off"} />
                </div>
                <h4>when?</h4>
                <select className="input input-medium form-countdown-type" value={this.state.countdownType} onChange={this.handleCountdownTypeChange}>
                    <option value={CountdownType.Duration}>duration</option>
                    <option value={CountdownType.Date}>date</option>
                </select>
                {this.renderSubSection()}
                <div>
                    <button type="submit" className="button button-medium">Start</button>
                </div>
            </form>
        );
    }
}