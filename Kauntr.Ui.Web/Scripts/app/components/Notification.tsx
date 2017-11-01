import * as React from "react";
import { Link } from "react-router";
import * as moment from "moment";

import {
    pluralizeNaive
} from "../helpers/StringHelpers";

import NotificationState from "../interfaces/NotificationState";

export default class Notification extends React.Component<NotificationState, any> {
    generateActionsString(): string {
        const { upvoteActions, downvoteActions, commentActions } = this.props;
        const a: Array<string> = [];

        if (upvoteActions > 0) {
            a.push(`${upvoteActions} ${pluralizeNaive(upvoteActions, "upvote")}`);
        }

        if (downvoteActions > 0) {
            a.push(`${downvoteActions} ${pluralizeNaive(downvoteActions, "downvote")}`);
        }

        if (commentActions > 0) {
            a.push(`${commentActions} ${pluralizeNaive(commentActions, "comments")}`);
        }

        return [a.slice(0, a.length - 1).join(", "), a.slice(a.length - 1)[0]].join(a.length < 2 ? "" : " and ");
    }

    render() {
        const { countdownId, commentId } = this.props;
        return (
            <div className="notification">
                <div>You have received {this.generateActionsString()} on your {commentId !== null ? "comment" : "countdown"} - <Link to={`/countdown/${countdownId}`}>{this.props.countdownContent}</Link></div>
                <div>last changed {this.props.lastChangedOn.fromNow()}</div>
                <div><a href="#" onClick={e => e.preventDefault()}>dismiss</a></div>
            </div>
        );
    }
}