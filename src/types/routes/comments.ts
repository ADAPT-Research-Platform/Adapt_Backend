export interface AddCommentBody {
  chapterId: string;
  parentCommentId?: string;
  content: string;
  userId: string;
}

export interface UpdateCommentBody {
  commentId: string;
  content: string;
}

export interface CommentResponse {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    username: string;
  };
  replies?: CommentResponse[];
}

export interface GetCommentsResponse {
  chapterId: string;
  comments: CommentResponse[];
}
