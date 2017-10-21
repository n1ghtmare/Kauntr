import * as React from "react";
import { Link } from "react-router";
import * as classNames from "classnames";
import * as marked from "marked";

import CommentState from "../interfaces/CommentState";

import LoadingIndicator from "./LoadingIndicator";

interface CommentStateExtended extends CommentState {
    onVoteCast: (id: number, vote: number) => void;
    countdownId: number;
    isAuthenticated: boolean;
}

export default class Comment extends React.Component<CommentStateExtended, { isDisplayingVoteAuthMessage: boolean }> {
    constructor(props: CommentStateExtended) {
        super(props);

        this.state = {
            isDisplayingVoteAuthMessage: false
        };
    }

    private voteCast = (value: number): void => {
        if (this.props.isAuthenticated) {
            this.props.onVoteCast(this.props.id, value);
        }
        else {
            this.setState({
                isDisplayingVoteAuthMessage: true
            });
        }
    }

    private handleUpVoteClick = (e: React.MouseEvent<HTMLAnchorElement>): void => {
        e.preventDefault();
        this.voteCast(1);
    }

    private handleDownVoteClick = (e: React.MouseEvent<HTMLAnchorElement>): void => {
        e.preventDefault();
        this.voteCast(-11);
    }

    renderScore() {
        const { currentUserVote, isCreatedByCurrentUser } = this.props;
        return (
            <div className="comment-score">
                <a title="This is awesome" className={classNames("vote-up", { "hidden": isCreatedByCurrentUser, "active": currentUserVote === 1 })} href="#" onClick={this.handleUpVoteClick}>&#43;</a>
                <span>{this.props.voteScore}</span>
                <a title="I don't like it" className={classNames("vote-down", { "hidden": isCreatedByCurrentUser, "active": currentUserVote === -1 })} href="#" onClick={this.handleDownVoteClick}>&minus;</a>
            </div>
        );
    }


    renderVoteAuthMessage() {
        return this.state.isDisplayingVoteAuthMessage
            ? (<div className="vote-auth-message animated shake">You have to <Link to={`/login?returnUrl=/countdown/${this.props.countdownId}`}>login</Link> first in order to vote</div>)
            : null;
    }

    render() {
        const { createdOn, isCastingVote } = this.props;
        return (
            <div className="comment">
                <div className="comment-avatar">
                    <div>created {createdOn === null ? "?" : createdOn.local().fromNow()}</div>
                    <div>by <Link to={`/account/${this.props.createdByAccountId}`}>{this.props.createdByDisplayName}</Link></div>
                    <div className="avatar-image-container">
                        <img width="42" height="42" alt="Avatar Image" src={this.props.createdByGravatarUrl} />
                    </div>
                </div>
                <div className="comment-text markdown-body" dangerouslySetInnerHTML={{ __html: marked(this.props.text) }} />
                {isCastingVote ? <LoadingIndicator isActive={isCastingVote} isTiny={true} /> : this.renderScore()}
                {this.renderVoteAuthMessage()}
            </div>
        );
    }
}