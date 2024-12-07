import createHttpError from 'http-errors';

import type {
  ModuleCreateBody,
  ChapterCreateBody,
  ExerciseCreateBody,
} from '../../types/routes/modules';

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

  if (!chapters || chapters.length === 0) {
    throw createHttpError(400, 'At least one chapter is required');
  }

  chapters.forEach((chapter, index) =>
    validateChapterCreateBody(chapter, index)
  );

  // Return the body as the validated type
  return body as ModuleCreateBody;
};

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

  if (!exercises || exercises.length === 0) {
    throw createHttpError(
      400,
      `Chapter${
        index !== undefined ? ` [${index + 1}]` : ''
      } must contain at least one exercise`
    );
  }

  exercises.forEach((exercise, exerciseIndex) =>
    validateExerciseCreateBody(
      exercise,
      index !== undefined ? `${index + 1}.${exerciseIndex + 1}` : undefined
    )
  );

  // Return the body as the validated type
  return body as ChapterCreateBody;
};

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
