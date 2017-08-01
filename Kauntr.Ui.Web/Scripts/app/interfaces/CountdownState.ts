import { Moment } from "moment";

interface CountdownState {
    isCreatingNew: boolean;
    isLoadingData: boolean;
    id?: number;
    description?: string;
    endsOn?: Moment;
    commentsCount?: number;
    createdOn?: Moment;
    createdByAccountId?: number;
    createdByDisplayName?: string;
    createdByGravatarUrl?: string;
    voteScore?: number;
    currentUserVote?: number;

    // TODO - Setup the comments and the way they'll be loaded
    // comments?: any[];
    // hasLoadedComments?: boolean
    // isLoadingComments?: boolean

    dispatch?: Function;
    router?: any;
}

export default CountdownState;