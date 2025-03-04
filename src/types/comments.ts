export interface AddCommentBody {
  text: string;
  chapterId: number;
  chapterUserId?: number;
}

export interface AddReplyBody {
  text: string;
  parentCommentId: number;
}

export interface CommentResponse {
  id: number;
  moduleId: number;
  chapterIndex: number;
  text: string;
  createdAt: Date;
  commentUserName: string;
  replies?: CommentResponse[];
}
