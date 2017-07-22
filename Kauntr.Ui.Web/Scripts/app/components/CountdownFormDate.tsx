import * as React from "react";
import * as classNames from "classnames";

type DateChangeFunc = (day: number, month: number, year: number, hour: number, minute: number) => void;

interface CountdownFormDateProps {
    day: number;
    month: number;
    year: number;
    hour: number;
    minute: number;
    onChange: DateChangeFunc;
}

interface CountdownFormDateState {
    day: number;
    month: number;
    year: number;
    hour: number;
    minute: number;
    isValid?: boolean;
}

// TODO - Validate fields and mark as errors on specific fields
export default class CountdownFormDate extends React.Component<CountdownFormDateProps, CountdownFormDateState> {
    constructor(props: CountdownFormDateProps) {
        super(props);

        this.state = {
            day: props.day,
            month: props.month,
            year: props.year,
            hour: props.hour,
            minute: props.minute,
            isValid: true
        };
    }

    private handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const day = parseInt(e.target.value, 10);
        this.setState({
            day
        }, () => this.props.onChange(day, this.state.month, this.props.year, this.props.hour, this.props.minute));
    }

    private handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const month = parseInt(e.target.value, 10);
        this.setState({
            month
        }, () => this.props.onChange(this.state.day, month, this.props.year, this.props.hour, this.props.minute));
    }

    private handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const year = parseInt(e.target.value, 10);
        this.setState({
            year
        }, () => this.props.onChange(this.state.day, this.state.month, year, this.props.hour, this.props.minute));
    }

    private handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const hour = parseInt(e.target.value, 10);
        this.setState({
            hour
        }, () => this.props.onChange(this.state.day, this.state.month, this.props.year, hour, this.props.minute));
    }

    private handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const minute = parseInt(e.target.value, 10);
        this.setState({
            minute
        }, () => this.props.onChange(this.props.day, this.state.month, this.props.year, this.props.hour, minute));
    }

    render() {
        const cx = classNames("input input-medium form-endson", { "input-validation-error": !this.state.isValid });
        return (
            <div>
                <input value={this.state.day || ""} type="text" className={cx} placeholder="dd" maxLength={2} onChange={this.handleDayChange} /><span className="text-medium-sub">/</span>
                <input value={this.state.month || ""} type="text" className="input input-medium form-endson" placeholder="mm" maxLength={2} onChange={this.handleMonthChange} /><span className="text-medium-sub">/</span>
                <input value={this.state.year || ""} type="text" className="input input-medium form-endson" placeholder="yyyy" maxLength={4} onChange={this.handleYearChange} /><span className="text-medium-sub">-</span>
                <input value={this.state.hour || ""} type="text" className="input input-medium form-endson" placeholder="HH" maxLength={2} onChange={this.handleHourChange} /><span className="text-medium-sub">:</span>
                <input value={this.state.minute || ""} type="text" className="input input-medium form-endson" placeholder="MM" maxLength={2} onChange={this.handleMinuteChange} />
                <div>example date: 21/7/2019 - 19:35 (time is optional)</div>
            </div>
        );
    }
}