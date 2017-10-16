import * as React from "react";
import { Link } from "react-router";
import * as moment from "moment";
import * as classNames from "classnames";

import {
    pluralizeNaive
} from "../helpers/StringHelpers";

import CountdownState from "../interfaces/CountdownState";

import LoadingIndicator from "./LoadingIndicator";

interface CountdownStateExtended extends CountdownState {
    onVoteCast: (id: number, vote: number) => void;
}

export default class Countdown extends React.Component<CountdownStateExtended, { remainingTime: string }> {
    constructor(props: CountdownStateExtended) {
        super(props);

        this.state = {
            remainingTime: ""
        };
    }

    private countdownIntervalId: number = null;

    private handleUpVoteClick = (e: React.MouseEvent<HTMLAnchorElement>): void => {
        e.preventDefault();
        this.props.onVoteCast(this.props.id, 1);
    }

    private handleDownVoteClick = (e: React.MouseEvent<HTMLAnchorElement>): void => {
        e.preventDefault();
        this.props.onVoteCast(this.props.id, -1);
    }

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

    renderTitle() {
        const titleLink = <Link to={`/countdown/${this.props.id}`}>{this.props.description}</Link>;
        const { endsOn, voteScore } = this.props;

        if (endsOn !== null && endsOn < moment()) {
            return (
                <div className="text-medium">
                    <div>{titleLink} ended</div>
                    <div>{endsOn.fromNow()}</div>
                </div>
            );
        }

        const durations: string[] = ["1s", "2s", "4s", "6s"];
        const animationDuration = voteScore < 0 ? durations[Math.floor((10 + Math.abs(voteScore < -10 ? -10 : voteScore)) * 0.2) - 1] : durations[0];
        const opacity: number = voteScore < 0 ? (10 - Math.abs(voteScore < -9 ? -9 : voteScore)) / 10 : 1;

        return (
            <div className="text-medium" style={{ opacity }}>
                <div className="countdown-pulse" style={{ animationDuration }}>{this.state.remainingTime}</div>
                <div>until {titleLink}</div>
            </div>
        );
    }

    renderCommentsCountLink() {
        const { commentsCount } = this.props;
        return this.props.isExpanded
            ? null
            : (<Link to={`/countdown/${this.props.id}`}>{commentsCount} {pluralizeNaive(commentsCount, "comment")}</Link>);
    }

    renderScore() {
        const { currentUserVote, isCreatedByCurrentUser } = this.props;
        return (
            <div className="text-medium countdown-score">
                <a title="This is awesome" className={classNames("vote-up", { "hidden": isCreatedByCurrentUser, "active": currentUserVote === 1 })} onClick={this.handleUpVoteClick} href="#">&#43;</a>
                <span>{this.props.voteScore}</span>
                <a title="I don't like it" className={classNames("vote-down", { "hidden": isCreatedByCurrentUser, "active": currentUserVote === -1 })} onClick={this.handleDownVoteClick} href="#">&minus;</a>
            </div>
        );
    }

    render() {
        const { createdOn, isCastingVote } = this.props;
        return (
            <div className="countdown">
                {this.renderTitle()}
                <div>created {createdOn === null ? "?" : createdOn.fromNow()}</div>
                <div>by <Link to={`/account/${this.props.createdByAccountId}`}>{this.props.createdByDisplayName}</Link></div>
                <div className="avatar-image-container">
                    <img width="52" height="52" alt="Avatar Image" src={this.props.createdByGravatarUrl} />
                </div>
                {isCastingVote ? <LoadingIndicator isActive={isCastingVote} isTiny={true} /> : this.renderScore()}
                {this.renderCommentsCountLink()}
            </div>
        );
    }
}