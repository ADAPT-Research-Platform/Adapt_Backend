export interface MoodCreateBody {
    userId: string;       // Reference to the user
    feeling: number;      // User's feeling score (1-5)
    motivation: number;   // User's motivation score (1-5)
    date: string;         // Date in YYYY-MM-DD format
}
