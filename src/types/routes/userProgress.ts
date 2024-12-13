export interface ChapterProgressCreateBody {
  chapterId: string; // The ID of the chapter for which progress is being tracked
  moduleProgressId: string; // The ID of the associated module progress
  progressPercentage?: number; // Optional, defaults to 0
  completionStatus?: "Not Started" | "In Progress" | "Completed"; // Optional, defaults to 'Not Started'
  completedAt?: Date | null; // Optional, only set if completed
}

export interface ChapterProgressUpdateBody extends ChapterProgressCreateBody {
  id: string; // ID of the progress record to update
}

export interface ChapterProgressResponse {
  id: string;
  chapterId: string; // The ID of the chapter this progress refers to
  moduleProgressId: string; // The ID of the associated module progress
  progressPercentage: number; // Progress percentage for the chapter (0-100%)
  completionStatus: "Not Started" | "In Progress" | "Completed"; // Status of the chapter's progress
  completedAt: Date | null; // Timestamp when the chapter was completed
  createdAt: Date; // Timestamp of creation
  updatedAt: Date; // Timestamp of last update
}

export interface ModuleProgressCreateBody {
  moduleId: string; // The ID of the module for which progress is being tracked
  progressPercentage?: number; // Optional, defaults to 0
  completionStatus?: "Not Started" | "In Progress" | "Completed"; // Optional, defaults to 'Not Started'
  completedAt?: Date | null; // Optional, only set if completed
}

export interface ModuleProgressUpdateBody extends ModuleProgressCreateBody {
  id: string; // ID of the progress record to update
}

export interface ModuleProgressResponse {
  id: string;
  moduleId: string; // The ID of the module this progress refers to
  progressPercentage: number; // Overall progress percentage (0-100%)
  completionStatus: "Not Started" | "In Progress" | "Completed"; // Status of the module's progress
  completedAt: Date | null; // Timestamp when the module was completed
  createdAt: Date; // Timestamp of creation
  updatedAt: Date; // Timestamp of last update
  chaptersProgress: ChapterProgressResponse[]; // Nested chapter progress records
}
