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

export interface ChapterUpdateBody extends ChapterCreateBody {
  id?: string; // Optional, as new chapters won't have an ID
  exercises: ExerciseUpdateBody[];
}

export interface ExerciseUpdateBody extends ExerciseCreateBody {
  id?: string; // Optional, as new exercises won't have an ID
}

// ExerciseResponse
export interface ExerciseResponse {
  id: string;
  title: string;
  content: string | null;
  order: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  files: FileResponse[]; // Uploaded files for this exercise
}

// ChapterResponse
export interface ChapterResponse {
  id: string;
  name: string;
  description: string | null;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  files: FileResponse[]; // Uploaded files for this chapter
  exercises: ExerciseResponse[]; // Nested exercises
}

// ModuleResponse
export interface ModuleResponse {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
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
