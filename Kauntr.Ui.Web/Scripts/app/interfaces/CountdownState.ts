import { Moment } from "moment";
import CommentListState from "./CommentListState";

interface CountdownState {
    isCreatingNew: boolean;
    isLoadingData: boolean;
    isExpanded: boolean;
    isCastingVote: boolean;
    id?: number;
    description?: string;
    endsOn?: Moment;
    commentsCount?: number;
    createdOn?: Moment;
    createdByAccountId?: number;
    createdByDisplayName?: string;
    createdByGravatarUrl?: string;
    voteScore?: number;
    isCreatedByCurrentUser?: boolean;
    currentUserVote?: number;
    commentList?: CommentListState;
    dispatch?: Function;
    router?: any;
}

export default CountdownState;