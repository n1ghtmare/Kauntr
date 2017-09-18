import * as React from "react";

import CommentListState from "../interfaces/CommentListState";

import Comment from "./Comment";

export default class CommentList extends React.Component<CommentListState, any> {
    render() {
        const comments = this.props.comments.map(x =>
            <Comment {...x} key={x.id} />
        );
        return (
            <div>
                <h4>{this.props.total} comments</h4>
                <div className="comments">
                    {comments}
                </div>
            </div>
        );
    }
}