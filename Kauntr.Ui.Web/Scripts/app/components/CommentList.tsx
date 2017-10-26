import * as React from "react";

import {
    pluralizeNaive
} from "../helpers/StringHelpers";

import CommentListState from "../interfaces/CommentListState";
import CommentDisplayOrderType from "../interfaces/CommentDisplayOrderType";

import Comment from "./Comment";
import CommentForm from "./CommentForm";
import CommentOrderControls from "./CommentOrderControls";
import Pagination from "./Pagination";
import LoadingIndicator from "./LoadingIndicator";

interface CommentListStateExtended extends CommentListState {
    countdownId: number;
    isAuthenticated: boolean;
    returnUrl?: string;
    onPageChange: (page: number) => void;
    onDisplayOrderChange: (displayOrder: CommentDisplayOrderType) => void;
    onCommentCreation: (text: string) => void;
    onCommentVoteCast: (commentId: number, value: number) => void;
    onRefresh: () => void;
}

export default class CommentList extends React.Component<CommentListStateExtended, any> {
    private handleRefreshClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        this.props.onRefresh();
    }

    renderUpdatesIndicator() {
        const { totalCreationsFromServer } = this.props;
        return totalCreationsFromServer === 0
            ? null
            : (
                <span className="muted">
                    - <a href="#" onClick={this.handleRefreshClick} title="refresh">
                        (has {totalCreationsFromServer} {pluralizeNaive(totalCreationsFromServer, "update")})
                    </a>
                </span>
            );
    }

    renderList() {
        const { total, isAuthenticated } = this.props;
        const comments = this.props.comments.map(x =>
            <Comment {...x} key={x.id} onVoteCast={this.props.onCommentVoteCast} isAuthenticated={isAuthenticated} countdownId={this.props.countdownId} />
        );

        return (
            <div className="animated fadeIn">
                <CommentForm isActive={this.props.isLoadingData || this.props.isCreatingNew} isAuthenticated={isAuthenticated} onSubmit={this.props.onCommentCreation} returnUrl={this.props.returnUrl} />
                <h4>{total} {pluralizeNaive(total, "comment")} {total === 0 ? "... yet" : null} {this.renderUpdatesIndicator()}</h4>
                <CommentOrderControls onChange={this.props.onDisplayOrderChange} displayOrderType={this.props.displayOrderType} itemsTotalCount={total} />
                <div className="comments">
                    {comments}
                </div>
                <Pagination page={this.props.page} pageSize={10} itemsTotalCount={total} onPageChange={this.props.onPageChange} className="pagination text-medium-sub" />
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