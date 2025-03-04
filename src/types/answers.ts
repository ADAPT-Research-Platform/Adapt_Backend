export interface AddAnswerBody {
  chapterId: number;
  text: object;
}

export interface GetAnswerBody {
  chapterId: number;
  moduleId: number;
  chapterIndex: number;
  updatedAt: Date;
  text: object;
}