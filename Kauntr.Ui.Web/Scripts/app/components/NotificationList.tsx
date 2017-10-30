import * as React from "react";
import { connect } from "react-redux";

import AppState from "../interfaces/AppState";
import NotificationListState from "../interfaces/NotificationListState";

export class NotificationList extends React.Component<NotificationListState, any> {
    render() {
        return (
            <h1>Notification List</h1>
        );
    }
}

function mapStateToProps(state: AppState, ownProps: any): NotificationListState {
    return state.notificationList;
}

export default connect(mapStateToProps, null)(NotificationList);