import { Moment } from "moment";

interface CommentState {
    id: number;
    text: string;
    createdOn: Moment;
    createdByAccountId: number;
    createdByDisplayName: string;
    createdByGravatarUrl: string;
    voteScore: number;
    currentUserVote?: number;
}

export default CommentState;