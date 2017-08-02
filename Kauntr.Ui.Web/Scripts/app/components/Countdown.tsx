import * as React from "react";
import { Link } from "react-router";
import * as moment from "moment";

import CountdownState from "../interfaces/CountdownState";

export default class Countdown extends React.Component<CountdownState, { remainingTime: string }> {
    constructor(props: CountdownState) {
        super(props);

        this.state = {
            remainingTime: ""
        };
    }

    private countdownIntervalId: number = null;

    componentDidMount() {
        if (this.props.endsOn > moment()) {
            this.updateRemainingTime();

            if (this.countdownIntervalId === null) {
                this.countdownIntervalId = setInterval(this.updateRemainingTime, 1000);
            }
        }
    }

    componentWillUnmount() {
        if (this.countdownIntervalId !== null) {
            clearInterval(this.countdownIntervalId);
        }
    }

    generateTimeSegment(value: number, name: string): string {
        const label: string = (value === 1) ? name : `${name}s`;
        return (value > 0) ? `${value} ${label} ` : "";
    }

    generateRemainingTime(): string {
        if (this.props.endsOn === null) {
            return null;
        }

        const currentDate: moment.Moment = moment();
        const duration: moment.Duration = moment.duration(this.props.endsOn.utc().diff(currentDate));

        return this.generateTimeSegment(Math.floor(duration.asDays()), "day")
            + this.generateTimeSegment(duration.hours(), "hour")
            + this.generateTimeSegment(duration.minutes(), "minute")
            + this.generateTimeSegment(duration.seconds(), "second");
    }

    private updateRemainingTime = () => {
        this.setState({
            remainingTime: this.generateRemainingTime()
        });
    }

    // TODO - Include pulse here as well (that slows down based on negative votes with the same rate as the opacity)
    getOpacity(): number {
        const { voteScore } = this.props;
        if (voteScore <= -10) {
            return 0.1;
        }

        if (voteScore <= -5) {
            return 0.3;
        }

        if (voteScore < 0) {
            return 0.7;
        }
        return 1;
    }

    renderTitle() {
        const titleLink = <Link to={`/countdown/${this.props.id}`}>{this.props.description}</Link>;
        const { endsOn } = this.props;

        if (endsOn !== null && endsOn < moment()) {
            return (
                <div className="text-medium">
                    <div>{titleLink} completed</div>
                    <div>{endsOn.fromNow()}</div>
                </div>
            );
        }

        return (
            <div className="text-medium">
                <div>{this.state.remainingTime}</div>
                <div>until {titleLink}</div>
            </div>
        );
    }

    render() {
        const { createdOn } = this.props;
        return (
            <div>
                {this.renderTitle()}
                <div>created {createdOn === null ? "?" : createdOn.fromNow()}</div>
                <div>by <Link to={`/account/${this.props.createdByAccountId}`}>{this.props.createdByDisplayName}</Link></div>
                <div className="avatar-image-container">
                    <img width="52" height="52" alt="Avatar Image" src={this.props.createdByGravatarUrl} />
                </div>
                <div className="text-medium countdown-score">
                    <a title="This is awesome" className="vote-up" href="#">&#43;</a>
                    <span>{this.props.voteScore}</span>
                    <a title="I don't like it" className="vote-down" href="#">&minus;</a>
                </div>
            </div>
        );
    }
}