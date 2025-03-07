export type NestedComment = {
  parentId: number | null;
  commentId: number;
  chapterUserId: number;
  chapterUsername: string;
  commentUserId: number;
  commentUsername: string;
  text: string;
  createdAt: string;
  replies: NestedComment[];
};

interface AnswerSet {
  createdAt: string; // Timestamp for the answer set
  [key: string]: { question: string; answer: string } | string; // Allow Q1, Q2, etc. as well as createdAt
}

export type ChapterData = {
  chapterId: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  progressPercentage: number;
  comments: NestedComment[];
  answers: AnswerSet[];
};

export type ModuleData = {
  moduleId: string;
  chapters: ChapterData[];
};
