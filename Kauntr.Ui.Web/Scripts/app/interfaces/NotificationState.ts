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
    commentContent: string;
    countdownContent: string;
}

export default NotificationState;