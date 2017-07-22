import * as React from "react";

import DurationType from "../constants/DurationType";

type DurationChangeFunc = (duration: number, durationType: DurationType) => void;

interface CountdownFormDurationProps {
    duration: number;
    durationType: DurationType;
    onChange: DurationChangeFunc;
}

interface CountdownFormDurationState {
    duration: number;
    durationType: DurationType;
}

export default class CountdownFormDuration extends React.Component<CountdownFormDurationProps, CountdownFormDurationState> {
    constructor(props: CountdownFormDurationProps) {
        super(props);

        this.state = {
            duration: props.duration,
            durationType: props.durationType || DurationType.Seconds
        };
    }

    private handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const duration: number = parseInt(e.target.value, 10);
        this.setState({
            duration
        }, () => this.props.onChange(duration, this.state.durationType));
    }

    private handleDurationTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const durationType: DurationType = parseInt(e.target.value, 10);
        this.setState({
            durationType
        }, () => this.props.onChange(this.state.duration, durationType));
    }

    render() {
        return (
            <div>
                <input value={this.state.duration || ""} type="text" className="input input-medium form-duration" placeholder="duration" onChange={this.handleDurationChange} />
                <select value={this.state.durationType} className="input input-medium form-duration-type" onChange={this.handleDurationTypeChange}>
                    <option value={DurationType.Seconds}>seconds</option>
                    <option value={DurationType.Minutes}>minutes</option>
                    <option value={DurationType.Hours}>hours</option>
                    <option value={DurationType.Days}>days</option>
                    <option value={DurationType.Months}>months</option>
                    <option value={DurationType.Years}>years</option>
                </select>
                <div>(from now)</div>
            </div>
        );
    }
}