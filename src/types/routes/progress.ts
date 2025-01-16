export interface CreateProgressBody {
  sectionId: number;
  progress: number;
}

export interface UserSection {
  userId: number;
  sectionId: number;
  name: string; // Name of the section
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  progressPercentage: number; // Progress of the section
  comments: SectionComment[]; // Array of section comments
}

export interface SectionComment {
  parentId: number | null; // Null for top-level comments
  commentId: number; // Unique ID of the comment
  sectionUserId: number; // ID of the user who owns the section
  sectionUsername: string; // Username of the section owner
  commentUserId: number; // ID of the user who made the comment
  commentUsername: string; // Username of the comment creator
  text: string; // Comment text
  createdAt: string; // ISO date string
  replies?: SectionComment[]; // Nested replies
}

