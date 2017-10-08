import * as React from "react";
import { Link } from "react-router";

import * as marked from "marked";

import CommentState from "../interfaces/CommentState";

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
                <div className="comment-score">
                    <a title="This is awesome" className="vote-up" href="#" onClick={this.handleUpVoteClick}>&#43;</a>
                    <span>{this.props.voteScore}</span>
                    <a title="I don't like it" className="vote-down" href="#" onClick={this.handleDownVoteClick}>&minus;</a>
                </div>
            </div>
        );
    };
}