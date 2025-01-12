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
  text: string;
  createdAt: Date;
  commentUserName: string;
  replies?: CommentResponse[];
}
