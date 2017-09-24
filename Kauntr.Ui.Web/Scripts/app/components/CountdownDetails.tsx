import * as React from "react";
import { connect } from "react-redux";

import {
    updateSharedContextTitle
} from "../actions/SharedContextActions";

import {
    fetchCountdownIfNeeded
} from "../actions/CountdownActions";

import {
    fetchCommentsIfNeeded,
    submitComment
} from "../actions/CommentActions";

import AppState from "../interfaces/AppState";
import CountdownState from "../interfaces/CountdownState";

import Countdown from "./Countdown";
import LoadingIndicator from "./LoadingIndicator";
import DiamondsSeparator from "./DiamondsSeparator";
import CommentList from "./CommentList";

interface CountdownStateExtended extends CountdownState {
    isAuthenticated?: boolean;
}

export class CountdownDetails extends React.Component<CountdownStateExtended, any> {
    componentDidMount() {
        const { dispatch } = this.props;
        const { params } = this.props.router;
        dispatch(updateSharedContextTitle("countdown"));

        dispatch(fetchCountdownIfNeeded(params.id))
            .then(() => dispatch(fetchCommentsIfNeeded(params.id, 1)));
    }

    private handleCommentListPageChange = (page: number): void => {
        const { dispatch, router } = this.props;
        dispatch(fetchCommentsIfNeeded(router.params.id, page));
    }

    private handleCommentCreation = (text: string): void => {
        const { dispatch, id } = this.props;
        dispatch(submitComment(id, text))
            .then(() => dispatch(fetchCommentsIfNeeded(id, 1)));
    }

    renderCountdown() {
        const { location } = this.props.router;
        return (
            <div className="animated fadeIn">
                <div className="row">
                    <Countdown {...this.props} />
                    <DiamondsSeparator />
                    <CommentList {...this.props.commentList} onPageChange={this.handleCommentListPageChange} onCommentCreation={this.handleCommentCreation} isAuthenticated={this.props.isAuthenticated} returnUrl={location.pathname} />
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

export default connect(mapStateToProps)(CountdownDetails);