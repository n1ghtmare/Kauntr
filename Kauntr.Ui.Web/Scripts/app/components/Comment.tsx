import * as React from "react";
import { Link } from "react-router";
import * as classNames from "classnames";
import * as marked from "marked";

import CommentState from "../interfaces/CommentState";

import LoadingIndicator from "./LoadingIndicator";

interface CommentStateExtended extends CommentState {
    onVoteCast: (id: number, vote: number) => void;
}

export default class Comment extends React.Component<CommentStateExtended, any> {
    private handleUpVoteClick = (e: React.MouseEvent<HTMLAnchorElement>): void => {
        e.preventDefault();
        this.props.onVoteCast(this.props.id, 1);
    }

    private handleDownVoteClick = (e: React.MouseEvent<HTMLAnchorElement>): void => {
        e.preventDefault();
        this.props.onVoteCast(this.props.id, -1);
    }

    renderScore() {
        const { currentUserVote } = this.props;
        return (
            <div className="comment-score">
                <a title="This is awesome" className={classNames("vote-up", { "active": currentUserVote === 1 })} href="#" onClick={this.handleUpVoteClick}>&#43;</a>
                <span>{this.props.voteScore}</span>
                <a title="I don't like it" className={classNames("vote-down", { "active": currentUserVote === -1 })} href="#" onClick={this.handleDownVoteClick}>&minus;</a>
            </div>
        );
    }

    render() {
        const { createdOn } = this.props;
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
                {
                    this.props.isCastingVote
                        ? <LoadingIndicator isActive={this.props.isCastingVote} isTiny={true} />
                        : this.renderScore()
                }
            </div>
        );
    }
}