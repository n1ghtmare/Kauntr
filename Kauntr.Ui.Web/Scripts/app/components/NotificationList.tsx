import * as React from "react";
import { connect } from "react-redux";

import {
    pluralizeNaive
} from "../helpers/StringHelpers";

import {
    updateSharedContextTitle
} from "../actions/SharedContextActions";

import {
    fetchNotificationsIfNeeded
} from "../actions/NotificationActions";

import AppState from "../interfaces/AppState";
import NotificationListState from "../interfaces/NotificationListState";

import Notification from "./Notification";
import LoadingIndicator from "./LoadingIndicator";

export class NotificationList extends React.Component<NotificationListState, any> {
    componentDidMount() {
        const { dispatch } = this.props;

        dispatch(updateSharedContextTitle("notifications"));
        dispatch(fetchNotificationsIfNeeded(1));
    }

    private handleDismissAllClick = (e: React.MouseEvent<HTMLAnchorElement>): void => {
        e.preventDefault();
        console.log("DISMISS ALL");
    }

    renderList() {
        const { total } = this.props;

        const statusTitle = total === 0
            ? <h3>nope, nothing here ...</h3>
            : null;

        const dismissAllLink = total > 1
            ? <span>(<a href="#" title="Dismiss All" onClick={this.handleDismissAllClick}>dismiss all</a>)</span>
            : null;

        const notifications = this.props.notifications.map(x =>
            <Notification {...x} key={x.id} />
        );

        return (
            <div className="animated fadeIn">
                <div className="row">
                    <h3>{total} {pluralizeNaive(total, "notification")} {dismissAllLink}</h3>
                    {statusTitle}
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