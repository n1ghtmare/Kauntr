import * as React from "react";
import { connect } from "react-redux";

import {
    updateSharedContextTitle
} from "../actions/SharedContextActions";

import {
    fetchCountdownDetailsIfNeeded
} from "../actions/CountdownActions";

import {
    fetchCommentsIfNeeded,
    submitComment
} from "../actions/CommentActions";

import {
    submitCommentVote,
    submitCountdownVote
} from "../actions/VoteActions";

import AppState from "../interfaces/AppState";
import CountdownState from "../interfaces/CountdownState";
import CommentDisplayOrderType from "../interfaces/CommentDisplayOrderType";

import Countdown from "./Countdown";
import LoadingIndicator from "./LoadingIndicator";
import DiamondsSeparator from "./DiamondsSeparator";
import CommentList from "./CommentList";

interface CountdownStateExtended extends CountdownState {
    isAuthenticated: boolean;
}

export class CountdownDetails extends React.Component<CountdownStateExtended, any> {
    componentDidMount() {
        const { dispatch, commentList } = this.props;
        const { params } = this.props.router;

        dispatch(updateSharedContextTitle("countdown"));

        dispatch(fetchCountdownDetailsIfNeeded(params.id))
            .then(() => dispatch(fetchCommentsIfNeeded(params.id, 1, commentList.displayOrderType)));
    }

    private handleCommentListPageChange = (page: number): void => {
        const { dispatch, router, commentList } = this.props;
        dispatch(fetchCommentsIfNeeded(router.params.id, page, commentList.displayOrderType));
    }

    private handleCommentListRefresh = (): void => {
        const { dispatch, router, commentList } = this.props;
        dispatch(fetchCommentsIfNeeded(router.params.id, 1, commentList.displayOrderType));
    }

    private handleCommentDisplayOrderChange = (displayOrderType: CommentDisplayOrderType): void => {
        const { dispatch, router } = this.props;
        dispatch(fetchCommentsIfNeeded(router.params.id, 1, displayOrderType));
    }

    private handleCommentCreation = (text: string): void => {
        const { dispatch, id } = this.props;
        dispatch(submitComment(id, text))
            .then(() => dispatch(fetchCommentsIfNeeded(id, 1, CommentDisplayOrderType.Latest)));
    }

    private handleCommentVoteCast = (commentId: number, value: number): void => {
        const { dispatch } = this.props;
        dispatch(submitCommentVote(commentId, value));
    }

    private handleCountdownVoteCast = (countdownId: number, value: number): void => {
        const { dispatch } = this.props;
        dispatch(submitCountdownVote(countdownId, value));
    }

    private handleCountdownDelete = (countdownId: number): void => {
        console.log("WILL DELETE COUNTDOWN: " + countdownId);
    }

    renderCountdown() {
        const { location } = this.props.router;
        return (
            <div className="animated fadeIn">
                <div className="row">
                    <Countdown {...this.props} isExpanded={true} onVoteCast={this.handleCountdownVoteCast} onDelete={this.handleCountdownDelete} />
                    <DiamondsSeparator />
                    <CommentList {...this.props.commentList}
                        onPageChange={this.handleCommentListPageChange}
                        onRefresh={this.handleCommentListRefresh}
                        onDisplayOrderChange={this.handleCommentDisplayOrderChange}
                        onCommentCreation={this.handleCommentCreation}
                        onCommentVoteCast={this.handleCommentVoteCast}
                        isAuthenticated={this.props.isAuthenticated}
                        countdownId={this.props.id}
                        returnUrl={location.pathname} />
                </div>
            </div>
        );
    }

    render() {
        const { isLoadingData } = this.props;
        return isLoadingData
            ? <LoadingIndicator isActive={isLoadingData} />
            : this.renderCountdown();
    }
}

function mapStateToProps(state: AppState, ownProps: any): CountdownStateExtended {
    return {
        isAuthenticated: state.sharedContext.currentUserAccountId !== null,
        ...state.countdown
    };
}

export default connect(mapStateToProps, null)(CountdownDetails);