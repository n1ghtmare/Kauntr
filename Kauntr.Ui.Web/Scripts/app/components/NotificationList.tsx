import * as React from "react";
import { connect } from "react-redux";

import {
    updateSharedContextTitle
} from "../actions/SharedContextActions";

import {
    fetchNotificationsIfNeeded
} from "../actions/NotificationActions";

import AppState from "../interfaces/AppState";
import NotificationListState from "../interfaces/NotificationListState";

import LoadingIndicator from "./LoadingIndicator";

export class NotificationList extends React.Component<NotificationListState, any> {
    componentDidMount() {
        const { dispatch } = this.props;

        dispatch(updateSharedContextTitle("notifications"));
        dispatch(fetchNotificationsIfNeeded(1));
    }

    renderList() {
        const notifications = this.props.notifications.map(x =>
            <div key={x.id}>notification - TODO (generate summary)</div>
        );
        return (
            <div className="animated fadeIn">
                <div className="row">
                    <h3>3 notifications</h3>
                    <div className="notifications">
                        {notifications}
                    </div>
                </div>
            </div>
        );
    }

    render() {
        const { isLoadingData } = this.props;
        return isLoadingData
            ? <LoadingIndicator isActive={isLoadingData} />
            : this.renderList();
    }
}

function mapStateToProps(state: AppState, ownProps: any): NotificationListState {
    return state.notificationList;
}

export default connect(mapStateToProps, null)(NotificationList);