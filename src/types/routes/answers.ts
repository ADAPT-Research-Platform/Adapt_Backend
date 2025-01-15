export interface AddAnswerBody {
  sectionId: number;
  text: object;
}

export interface GetAnswerBody {
  sectionId: number;
  updatedAt: Date;
  text: object;
}