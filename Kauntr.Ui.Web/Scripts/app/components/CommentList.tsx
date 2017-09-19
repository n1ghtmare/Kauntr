import * as React from "react";

import CommentListState from "../interfaces/CommentListState";

import Comment from "./Comment";
import Pagination from "./Pagination";

export default class CommentList extends React.Component<CommentListState, any> {
    render() {
        const { total } = this.props;
        const comments = this.props.comments.map(x =>
            <Comment {...x} key={x.id} />
        );
        return (
            <div>
                <h4>{total} comments</h4>
                <div className="comments">
                    {comments}
                </div>
                <Pagination page={this.props.page} pageSize={10} itemsTotalCount={total} onPageChange={p => console.log("Will change to page: " + p)} className="pagination text-medium-sub" />
            </div>
        );
    }
}