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
    fileUrl?: string; // Optional, URL of the markdown file
    exercises: ExerciseCreateBody[]; // At least one exercise is required
}

export interface ExerciseCreateBody {
    title: string;
    content?: string; // Optional content
    order: number; // The order of the exercise in the chapter
    difficulty?: 'Easy' | 'Medium' | 'Hard'; // Optional, defaults to 'Medium'
    isActive?: boolean; // Optional, defaults to true
    fileUrl?: string; // Optional, URL of the markdown file
}

// ExerciseResponse
export interface ExerciseResponse {
    id: string;
    title: string;
    content: string | null;
    order: number;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    isActive: boolean;
    fileUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
}

// ChapterResponse
export interface ChapterResponse {
    id: string;
    name: string;
    description: string | null;
    order: number;
    isActive: boolean;
    fileUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
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

