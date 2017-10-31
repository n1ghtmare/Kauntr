import { Moment } from "moment";

interface NotificationState {
    id: number;
    ownedByAccountId: number;
    lastChangedOn: Moment;
    countdownId?: number;
    commentId?: number;
    upvoteActions: number;
    downvoteActions: number;
    commentActions: number;
    summary: string;
}

export default NotificationState;