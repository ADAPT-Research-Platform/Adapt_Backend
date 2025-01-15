export interface AddCommentBody {
  text: string;
  sectionId: number;
  sectionUserId?: number;
}

export interface AddReplyBody {
  text: string;
  parentCommentId: number;
}

export interface CommentResponse {
  id: number;
  text: string;
  createdAt: Date;
  commentUserName: string;
  replies?: CommentResponse[];
}
