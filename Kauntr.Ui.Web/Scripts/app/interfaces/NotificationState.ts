import { Moment } from "moment";

interface NotificationState {
    id: number;
    ownedByAccountId: number;
    lastChangedOn: Moment;
    countdownId?: number;
    commentId?: number;
    summary: string;
}

export default NotificationState;