export interface AddAnswerBody {
  chapterId: number;
  text: object;
}

export interface GetAnswerBody {
  chapterId: number;
  updatedAt: Date;
  text: object;
}