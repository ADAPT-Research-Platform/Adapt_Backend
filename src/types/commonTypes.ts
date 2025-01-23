export type NestedComment = {
  parentId: number | null;
  commentId: number;
  sectionUserId: number;
  sectionUsername: string;
  commentUserId: number;
  commentUsername: string;
  text: string;
  createdAt: string;
  replies: NestedComment[];
};

export type SectionData = {
  sectionId: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  progressPercentage: number;
  comments: NestedComment[];
  answers: Record<string, { question: string; answer: string }>; // Add answers property
};

export type ChapterData = {
  chapterId: string;
  sections: SectionData[];
};

export type ModuleData = {
  moduleId: string;
  chapters: ChapterData[];
};
