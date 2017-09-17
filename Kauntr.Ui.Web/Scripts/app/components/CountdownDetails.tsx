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
                    <h4>23 comments</h4>

                    <div className="comments">
                        <div className="comment">
                            <div>created 3 days ago</div>
                            <div>by <a href="#">Haxor</a></div>
                            <div className="avatar-image-container">
                                <img width="42" height="42" alt="Avatar Image" src="http://www.gravatar.com/avatar/3c65be11257c594389753a6b5de12569?s=42&d=mm" />
                            </div>
                            <div className="comment-text">
                                My test comment here yo My test comment here yoMy test comment here yoMy test comment here yoMy test comment here yoMy test comment here yoMy test comment here yoMy test comment here yoMy test comment here yoMy test comment here yo
                        </div>
                            <div className="comment-score">
                                <a title="This is awesome" className="vote-up" href="#">&#43;</a>
                                <span>0</span>
                                <a title="I don't like it" className="vote-down" href="#">&minus;</a>
                            </div>
                        </div>


                        <div className="comment">
                            <div>created 3 days ago</div>
                            <div>by <a href="#">Haxor</a></div>
                            <div className="avatar-image-container">
                                <img width="42" height="42" alt="Avatar Image" src="http://www.gravatar.com/avatar/3c65be11257c594389753a6b5de12569?s=42&d=mm" />
                            </div>
                            <div>
                                My test comment here yo My test comment here yoMy test comment here yoMy test comment here yoMy test comment here yoMy test comment here yoMy test comment here yoMy test comment here yoMy test comment here yoMy test comment here yo
                        </div>
                            <div className="comment-score">
                                <a title="This is awesome" className="vote-up" href="#">&#43;</a>
                                <span>0</span>
                                <a title="I don't like it" className="vote-down" href="#">&minus;</a>
                            </div>
                        </div>
                    </div>

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