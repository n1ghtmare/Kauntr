import * as React from "react";
import { connect } from "react-redux";

import {
    updateSharedContextTitle
} from "../actions/SharedContextActions";

import {
    fetchCountdownIfNeeded
} from "../actions/CountdownActions";

import {
    fetchCommentsIfNeeded
} from "../actions/CommentActions";

import AppState from "../interfaces/AppState";
import CountdownState from "../interfaces/CountdownState";

import Countdown from "./Countdown";
import LoadingIndicator from "./LoadingIndicator";
import DiamondsSeparator from "./DiamondsSeparator";
import CommentList from "./CommentList";
import CommentForm from "./CommentForm";

export class CountdownDetails extends React.Component<CountdownState, any> {
    componentDidMount() {
        const { dispatch } = this.props;
        const { params } = this.props.router;
        dispatch(updateSharedContextTitle("countdown"));

        // TODO - Decide if comments should load simultaniously or after the
        dispatch(fetchCountdownIfNeeded(params.id))
            .then(() => dispatch(fetchCommentsIfNeeded(params.id, 1)));
    }

    renderCountdown() {
        return (
            <div className="animated fadeIn">
                <div className="row">
                    <Countdown {...this.props} />
                    <DiamondsSeparator />

                    {/* TODO - Remove these prototype comments left for design purposes */}

                    <CommentList {...this.props.commentList} />
                    {/* TODO - Add a check for when the current user is authenticated (otherwise add a message with a link to login) */}
                    <CommentForm isActive={this.props.isLoadingData} onSubmit={(content) => console.log(content)} />

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

function mapStateToProps(state: AppState, ownProps: any): CountdownState {
    return state.countdown;
}

export default connect(mapStateToProps)(CountdownDetails);