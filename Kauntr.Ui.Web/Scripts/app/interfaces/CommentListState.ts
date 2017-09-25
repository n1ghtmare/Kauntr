import CommentDisplayOrderType from "../interfaces/CommentDisplayOrderType";

import CommentState from "./CommentState";

interface CommentListState {
    isLoadingData: boolean;
    isCreatingNew: boolean;
    comments: Array<CommentState>;
    total: number;
    page: number;
    displayOrderType: CommentDisplayOrderType;
    token?: number;
}

export default CommentListState;