import CommentDisplayOrderType from "../interfaces/CommentDisplayOrderType";

import CommentState from "./CommentState";

interface CommentListState {
    isLoadingData: boolean;
    isCreatingNew: boolean;
    comments: Array<CommentState>;
    total: number;
    page: number;
    displayOrderType: CommentDisplayOrderType;
    totalCreationsFromServer: number;
    token?: number;
}

export default CommentListState;