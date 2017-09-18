import * as React from "react";
import { Link } from "react-router";

import CommentState from "../interfaces/CommentState";

export default class Comment extends React.Component<CommentState, any> {
    render() {
        const { createdOn } = this.props;
        return (
            <div className="comment">
                <div className="comment-avatar">
                    <div>created {createdOn === null ? "?" : createdOn.fromNow()}</div>
                    <div>by <Link to={`/account/${this.props.createdByAccountId}`}>{this.props.createdByDisplayName}</Link></div>
                    <div className="avatar-image-container">
                        <img width="42" height="42" alt="Avatar Image" src={this.props.createdByGravatarUrl} />
                    </div>
                </div>
                <div className="comment-text">
                    {this.props.text}
                </div>
                <div className="comment-score">
                    <a title="This is awesome" className="vote-up" href="#">&#43;</a>
                    <span>{this.props.voteScore}</span>
                    <a title="I don't like it" className="vote-down" href="#">&minus;</a>
                </div>
            </div>
        );
    };
}