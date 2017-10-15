import { Moment } from "moment";

interface CommentState {
    isCastingVote: boolean;
    id: number;
    text: string;
    createdOn: Moment;
    createdByAccountId: number;
    createdByDisplayName: string;
    createdByGravatarUrl: string;
    voteScore: number;
    isCreatedByCurrentUser: boolean;
    currentUserVote?: number;
}

export default CommentState;