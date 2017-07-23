import * as React from "react";
import * as moment from "moment";
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
    day: DateSegment;
    month: DateSegment;
    year: DateSegment;
    hour: DateSegment;
    minute: DateSegment;
}

interface DateSegment {
    value: number;
    isValid?: boolean;
}


// TODO - Simplify the validation - became too complex (maybe validate all at once)
export default class CountdownFormDate extends React.Component<CountdownFormDateProps, CountdownFormDateState> {
    constructor(props: CountdownFormDateProps) {
        super(props);

        this.state = {
            day: { value: props.day, isValid: true },
            month: { value: props.month, isValid: true },
            year: { value: props.year, isValid: true },
            hour: { value: props.hour, isValid: true },
            minute: { value: props.minute, isValid: true }
        };
    }

    validateDay(): void {
        const { value } = this.state.day;
        const { year, month, hour, minute } = this.state;
        const today: moment.Moment = moment();
        const date: moment.Moment = moment({
            year: year.value || today.year(),
            month: (month.value || today.month()) - 1,
            d: value,
            hour: hour.value || today.hour(),
            minute: minute.value || today.minute()
        });

        this.setState({
            day: {
                ...this.state.day,
                isValid: value > 0 && value <= date.daysInMonth() && today.diff(date) < 0
            }
        });
    }

    private handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        this.setState({
            day: { value }
        }, this.validateDay);
    }

    validateMonth(): void {
        const { value } = this.state.month;
        this.setState({
            month: {
                ...this.state.month,
                isValid: value > 0 && value <= 12
            }
        }, this.validateDay);
    }

    private handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        this.setState({
            month: { value }
        }, this.validateMonth);
    }

    validateYear(): void {
        const { value } = this.state.year;
        this.setState({
            year: {
                ...this.state.year,
                isValid: value >= moment().year()
            }
        }, this.validateMonth);
    }

    private handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        this.setState({
            year: { value }
        }, this.validateYear);
    }

    validateHour(): void {
        const { value } = this.state.hour;
        this.setState({
            hour: {
                ...this.state.hour,
                isValid: value <= 24
            }
        }, this.validateYear);
    }

    private handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        this.setState({
            hour: { value }
        }, this.validateHour);
    }

    validateMinute(): void {
        const { value } = this.state.minute;
        this.setState({
            minute: {
                ...this.state.minute,
                isValid: value > 0 && value < 60
            }
        }, this.validateHour);
    }

    private handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        this.setState({
            minute: { value }
        }, this.validateMinute);
    }

    generateCss(dateSegment: DateSegment): string {
        return classNames("input input-medium form-endson", { "input-validation-error": !dateSegment.isValid });
    }

    render() {
        const { day, month, year, hour, minute } = this.state;
        return (
            <div>
                <input value={day.value || ""} type="text" className={this.generateCss(day)} placeholder="dd" maxLength={2} onChange={this.handleDayChange} /><span className="text-medium-sub">/</span>
                <input value={month.value || ""} type="text" className={this.generateCss(month)} placeholder="mm" maxLength={2} onChange={this.handleMonthChange} /><span className="text-medium-sub">/</span>
                <input value={year.value || ""} type="text" className={this.generateCss(year)} placeholder="yyyy" maxLength={4} onChange={this.handleYearChange} /><span className="text-medium-sub">-</span>
                <input value={hour.value || ""} type="text" className={this.generateCss(hour)} placeholder="HH" maxLength={2} onChange={this.handleHourChange} /><span className="text-medium-sub">:</span>
                <input value={minute.value || ""} type="text" className={this.generateCss(minute)} placeholder="MM" maxLength={2} onChange={this.handleMinuteChange} />
                <div>example date: 21/7/2019 - 19:35 (time is optional)</div>
            </div>
        );
    }
}