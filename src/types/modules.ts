export interface ModuleCreateBody {
  name: string;
  description?: string; // Optional description
  isActive?: boolean; // Optional, defaults to true
  chapters: ChapterCreateBody[]; // At least one chapter is required
}

export interface ChapterCreateBody {
  name: string;
  description?: string; // Optional description
  order: number; // The order of the chapter in the module
  isActive?: boolean; // Optional, defaults to true
  files?: FileCreateBody[]; // Optional: Uploaded files
  exercises: ExerciseCreateBody[]; // At least one exercise is required
}

export interface ExerciseCreateBody {
  title: string;
  content?: string; // Optional content
  order: number; // The order of the exercise in the chapter
  difficulty?: 'Easy' | 'Medium' | 'Hard'; // Optional, defaults to 'Medium'
  isActive?: boolean; // Optional, defaults to true
  files?: FileCreateBody[]; // Optional: Uploaded files
}

// ExerciseResponse
export interface ChapterResponse {
  id: number;
  index: number;
  updatedAt: Date;
  title: string;
  folderUrl: string;
  isExercise: boolean;
  progress: number;
  numOfComments: number;
}

// ModuleResponse
export interface ModuleResponse {
  id: number;
  chapters: ChapterResponse[]; // Nested chapters
}

export interface FileCreateBody {
  filePath: string; // Path to the uploaded file
}

export interface FileResponse {
  id: string; // Unique identifier for the file
  filePath: string; // Path to the uploaded file
  uploadedAt: Date; // Upload timestamp
}
