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
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: number;
    username: string;
  };
  replies?: CommentResponse[];
}

export interface GetCommentsResponse {
  sectionId: number;
  comments: CommentResponse[];
}
