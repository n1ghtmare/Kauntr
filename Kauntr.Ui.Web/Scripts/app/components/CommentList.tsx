import * as React from "react";

import CommentListState from "../interfaces/CommentListState";

import Comment from "./Comment";
import CommentForm from "./CommentForm";
import Pagination from "./Pagination";
import LoadingIndicator from "./LoadingIndicator";

interface CommentListStateExtended extends CommentListState {
    isAuthenticated?: boolean;
    returnUrl?: string;
    onPageChange: (page: number) => void;
}

export default class CommentList extends React.Component<CommentListStateExtended, any> {
    renderList() {
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
                <Pagination page={this.props.page} pageSize={10} itemsTotalCount={total} onPageChange={this.props.onPageChange} className="pagination text-medium-sub" />
                <CommentForm isActive={this.props.isLoadingData} isAuthenticated={this.props.isAuthenticated} onSubmit={(content) => console.log(content)} returnUrl={this.props.returnUrl} />
            </div>
        );
    }

    render() {
        const { isLoadingData } = this.props;
        return isLoadingData
            ? <LoadingIndicator isActive={isLoadingData} className="loader-mini" />
            : this.renderList();
    }
}