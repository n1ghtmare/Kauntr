import * as React from "react";
import * as moment from "moment";
import * as classNames from "classnames";

type DateChangeFunc = (day: number, month: number, year: number, hour: number, minute: number, isValid: boolean) => void;

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
    hour?: number;
    minute?: number;
    isValid: boolean;
}

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

    private validationInterval: number = null;
    private placeholderDate: string = moment().add(1, "years").format("D/M/YYYY HH:mm");

    componentWillUnmount() {
        if (this.validationInterval !== null) {
            clearInterval(this.validationInterval);
        }
    }

    validateDate(): void {
        const { day, month, year, hour, minute } = this.state;
        const now: moment.Moment = moment();
        const date: moment.Moment = moment({
            year: year || now.year(),
            month: (month || now.month()) - 1,
            d: day || now.day(),
            hour: hour || now.hour(),
            minute: minute || now.minute()
        });

        this.setState({
            isValid: date.diff(now, "seconds") > 239
        }, this.handleDateChange);
    }

    populateMissingDateSegmentsAndValidate(): void {
        const { day, month, year, hour, minute } = this.state;
        const now: moment.Moment = moment();

        this.setState({
            day: day || now.date(),
            month: month || (now.month() + 1),
            year: year || now.year(),
            hour: hour === 0 ? 0 : (hour || now.hour()),
            minute: minute === 0 ? 0 : (minute || now.minute() + 5)
        }, this.validateDate);
    }

    private handleDateChange = () => {
        const { day, month, year, hour, minute, isValid } = this.state;
        this.props.onChange(day, month, year, hour, minute, isValid);

        if (this.validationInterval === null) {
            this.validationInterval = setInterval(() => this.validateDate(), 1000);
        }
    }

    private handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            day: parseInt(e.target.value, 10)
        }, this.populateMissingDateSegmentsAndValidate);
    }

    private handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            month: parseInt(e.target.value, 10)
        }, this.populateMissingDateSegmentsAndValidate);
    }

    private handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            year: parseInt(e.target.value, 10)
        }, this.populateMissingDateSegmentsAndValidate);
    }

    private handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            hour: parseInt(e.target.value, 10)
        }, this.populateMissingDateSegmentsAndValidate);
    }

    private handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            minute: parseInt(e.target.value, 10)
        }, this.populateMissingDateSegmentsAndValidate);
    }

    render() {
        const { day, month, year, hour, minute } = this.state;
        const cx = classNames("input input-medium form-endson", { "input-validation-error": !this.state.isValid });
        return (
            <div>
                <input value={day || ""} type="text" className={cx} placeholder="dd" maxLength={2} onChange={this.handleDayChange} /><span className="text-medium-sub">/</span>
                <input value={month || ""} type="text" className={cx} placeholder="mm" maxLength={2} onChange={this.handleMonthChange} /><span className="text-medium-sub">/</span>
                <input value={year || ""} type="text" className={cx} placeholder="yyyy" maxLength={4} onChange={this.handleYearChange} /><span className="text-medium-sub">-</span>
                <input value={hour || ""} type="text" className={cx} placeholder="HH" maxLength={2} onChange={this.handleHourChange} /><span className="text-medium-sub">:</span>
                <input value={minute || ""} type="text" className={cx} placeholder="MM" maxLength={2} onChange={this.handleMinuteChange} />
                <p>example date: {this.placeholderDate} (exact time is optional)</p>
            </div>
        );
    }
}