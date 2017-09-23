import CommentState from "./CommentState";

interface CommentListState {
    isLoadingData: boolean;
    isCreatingNew: boolean;
    comments: Array<CommentState>;
    total: number;
    page: number;
    token?: number;
}

export default CommentListState;