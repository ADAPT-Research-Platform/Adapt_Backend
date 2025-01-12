export interface AddCommentBody {
  text: string;
  sectionId: number;
  sectionUserId?: number;
  parentCommentId?: number;
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
