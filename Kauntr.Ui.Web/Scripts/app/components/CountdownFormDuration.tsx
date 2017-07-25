import * as React from "react";
import * as classNames from "classnames";

import DurationType from "../constants/DurationType";

type DurationChangeFunc = (duration: number, durationType: DurationType, isValid: boolean) => void;

interface CountdownFormDurationProps {
    duration: number;
    durationType: DurationType;
    onChange: DurationChangeFunc;
}

interface CountdownFormDurationState {
    duration: number;
    durationType: DurationType;
    isValid: boolean;
}

export default class CountdownFormDuration extends React.Component<CountdownFormDurationProps, CountdownFormDurationState> {
    constructor(props: CountdownFormDurationProps) {
        super(props);

        this.state = {
            duration: props.duration,
            durationType: props.durationType || DurationType.Seconds,
            isValid: true
        };
    }

    isValidDuration(duration: number, durationType: DurationType): boolean {
        switch (durationType) {
            case DurationType.Seconds:
                return duration > 240;
            case DurationType.Minutes:
                return duration > 4;
            default:
                return duration >= 1;
        }
    }

    validateDuration(): void {
        const { duration, durationType } = this.state;

        this.setState({
            isValid: this.isValidDuration(duration, durationType)
        }, () => this.props.onChange(this.state.duration, this.state.durationType, this.state.isValid));
    }

    private handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const duration: number = parseInt(e.target.value, 10);
        this.setState({
            duration
        }, this.validateDuration);
    }

    private handleDurationTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const durationType: DurationType = parseInt(e.target.value, 10);
        this.setState({
            durationType
        }, this.validateDuration);
    }

    render() {
        const cx = classNames("input input-medium form-duration", { "input-validation-error": !this.state.isValid });
        return (
            <div>
                <input value={this.state.duration || ""} type="text" className={cx} placeholder="duration" onChange={this.handleDurationChange} />
                <select value={this.state.durationType} className={cx} onChange={this.handleDurationTypeChange}>
                    <option value={DurationType.Seconds}>seconds</option>
                    <option value={DurationType.Minutes}>minutes</option>
                    <option value={DurationType.Hours}>hours</option>
                    <option value={DurationType.Days}>days</option>
                    <option value={DurationType.Months}>months</option>
                    <option value={DurationType.Years}>years</option>
                </select>
                <p>(from now)</p>
            </div>
        );
    }
}