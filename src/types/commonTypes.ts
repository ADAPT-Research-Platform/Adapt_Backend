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

export type ChapterData = {
  chapterId: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  progressPercentage: number;
  comments: NestedComment[];
  answers: Record<string, { question: string; answer: string }>; // Add answers property
};

export type ModuleData = {
  moduleId: string;
  chapters: ChapterData[];
};
