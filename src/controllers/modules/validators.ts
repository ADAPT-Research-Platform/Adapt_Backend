import createHttpError from 'http-errors';

import type {
  ModuleCreateBody,
  ChapterCreateBody,
  ExerciseCreateBody,
} from '../../types/routes/modules';

// Utility function to parse JSON strings into arrays
const parseJsonArray = <T>(input: unknown, fieldName: string): T[] => {
  if (typeof input === 'string') {
    try {
      return JSON.parse(input) as T[];
    } catch (error) {
      throw createHttpError(400, `${fieldName} must be a valid JSON array.`);
    }
  }

  if (!Array.isArray(input)) {
    throw createHttpError(400, `${fieldName} must be an array.`);
  }

  return input as T[];
};

// Validate the module creation body
export const validateModuleCreateBody = (body: Partial<ModuleCreateBody>) => {
  const { name, chapters } = body;

  if (!name) {
    throw createHttpError(400, 'Module name is required');
  }
  if (name.length < 5) {
    throw createHttpError(
      400,
      'Module name must contain at least 5 characters'
    );
  }

  // Parse and validate chapters
  body.chapters = parseJsonArray<ChapterCreateBody>(chapters, 'Chapters');

  if (body.chapters.length === 0) {
    throw createHttpError(400, 'At least one chapter is required.');
  }

  body.chapters.forEach((chapter, index) =>
    validateChapterCreateBody(chapter, index)
  );

  // Return the body as the validated type
  return body as ModuleCreateBody;
};

// Validate a single chapter body
export const validateChapterCreateBody = (
  body: Partial<ChapterCreateBody>,
  index?: number
) => {
  const { name, order, exercises } = body;

  if (!name) {
    throw createHttpError(
      400,
      `Chapter${index !== undefined ? ` [${index + 1}]` : ''} name is required`
    );
  }
  if (name.length < 5) {
    throw createHttpError(
      400,
      `Chapter${
        index !== undefined ? ` [${index + 1}]` : ''
      } name must contain at least 5 characters`
    );
  }

  if (order === undefined || order === null) {
    throw createHttpError(
      400,
      `Chapter${index !== undefined ? ` [${index + 1}]` : ''} order is required`
    );
  }
  if (!Number.isInteger(order) || order <= 0) {
    throw createHttpError(
      400,
      `Chapter${
        index !== undefined ? ` [${index + 1}]` : ''
      } order must be a positive integer`
    );
  }

  // Parse and validate exercises
  body.exercises = parseJsonArray<ExerciseCreateBody>(
    exercises,
    `Exercises for Chapter${index !== undefined ? ` [${index + 1}]` : ''}`
  );

  if (body.exercises.length === 0) {
    throw createHttpError(
      400,
      `Chapter${
        index !== undefined ? ` [${index + 1}]` : ''
      } must contain at least one exercise.`
    );
  }

  body.exercises.forEach((exercise, exerciseIndex) =>
    validateExerciseCreateBody(
      exercise,
      index !== undefined ? `${index + 1}.${exerciseIndex + 1}` : undefined
    )
  );

  // Return the body as the validated type
  return body as ChapterCreateBody;
};

// Validate a single exercise body
export const validateExerciseCreateBody = (
  body: Partial<ExerciseCreateBody>,
  index?: string
) => {
  const { title, order, difficulty } = body;

  if (!title) {
    throw createHttpError(
      400,
      `Exercise${index ? ` [${index}]` : ''} title is required`
    );
  }
  if (title.length < 5) {
    throw createHttpError(
      400,
      `Exercise${
        index ? ` [${index}]` : ''
      } title must contain at least 5 characters`
    );
  }

  if (order === undefined || order === null) {
    throw createHttpError(
      400,
      `Exercise${index ? ` [${index}]` : ''} order is required`
    );
  }
  if (!Number.isInteger(order) || order <= 0) {
    throw createHttpError(
      400,
      `Exercise${index ? ` [${index}]` : ''} order must be a positive integer`
    );
  }

  if (difficulty && !['Easy', 'Medium', 'Hard'].includes(difficulty)) {
    throw createHttpError(
      400,
      `Exercise${
        index ? ` [${index}]` : ''
      } difficulty must be one of 'Easy', 'Medium', or 'Hard'`
    );
  }

  // Return the body as the validated type
  return body as ExerciseCreateBody;
};
