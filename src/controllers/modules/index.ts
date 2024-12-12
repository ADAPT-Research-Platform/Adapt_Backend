import type { Response, Request } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import createHttpError from 'http-errors';

import { AppDataSource } from '../../data-source';
import { Module } from '../../entities/module';
import { Chapter } from '../../entities/chapter';
import { Exercise } from '../../entities/exercise';
import type {
  ModuleCreateBody,
  ModuleResponse,
  ChapterUpdateBody,
} from '../../types/routes/modules';
import { validateModuleCreateBody } from './validators';

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Acceptable file extensions
    const fileTypes = /md|jpeg|jpg|png|gif/;

    // Check file extension
    const extName = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    // Check MIME type
    const mimeType =
      file.mimetype === 'text/markdown' ||
      file.mimetype === 'text/plain' ||
      file.mimetype.startsWith('image/');

    if (extName && mimeType) {
      cb(null, true);
    } else {
      cb(new Error('Only .md, .jpg, .jpeg, .png, and .gif files are allowed'));
    }
  },
});

// Updated `create` function to handle file uploads
const create = async (
  req: TypedRequestBody<ModuleCreateBody>,
  res: Response
) => {
  // Apply the multer middleware
  await new Promise<void>((resolve, reject) => {
    upload.fields([
      { name: 'chapterFiles', maxCount: 10 },
      { name: 'exerciseFiles', maxCount: 20 },
    ])(req, res, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });

  // Access uploaded files
  const chapterFiles = req.files?.['chapterFiles'] || [];
  const exerciseFiles = req.files?.['exerciseFiles'] || [];

  const {
    name,
    description,
    isActive = true,
    chapters,
  } = validateModuleCreateBody(req.body);

  const queryRunner = AppDataSource.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const moduleRepo = queryRunner.manager.getRepository(Module);

    // Check for module name uniqueness
    const moduleExists = await moduleRepo.exist({
      where: { name },
    });
    if (moduleExists) {
      throw createHttpError(409, 'Module name already exists');
    }

    // Create and save the module
    const newModule = new Module();
    newModule.name = name;
    newModule.description = description ?? null;
    newModule.isActive = isActive;
    await queryRunner.manager.save(newModule);

    // Save chapters and exercises
    for (let i = 0; i < chapters.length; i++) {
      const chapterData = chapters[i];
      const chapterFilePath = chapterFiles[i]?.path || null;

      const newChapter = new Chapter();
      newChapter.name = chapterData.name;
      newChapter.description = chapterData.description ?? null;
      newChapter.order = chapterData.order;
      newChapter.isActive = chapterData.isActive ?? true;
      newChapter.fileUrl = chapterFilePath; // Save uploaded file path
      newChapter.module = newModule;
      await queryRunner.manager.save(newChapter);

      // Save exercises
      const { exercises } = chapterData;
      for (let j = 0; j < exercises.length; j++) {
        const exerciseData = exercises[j];
        const exerciseFilePath = exerciseFiles[j]?.path || null;

        const newExercise = new Exercise();
        newExercise.title = exerciseData.title;
        newExercise.content = exerciseData.content ?? null;
        newExercise.order = exerciseData.order;
        newExercise.difficulty = exerciseData.difficulty ?? 'Medium';
        newExercise.isActive = exerciseData.isActive ?? true;
        newExercise.fileUrl = exerciseFilePath; // Save uploaded file path
        newExercise.chapter = newChapter;
        await queryRunner.manager.save(newExercise);
      }
    }

    await queryRunner.commitTransaction();
    res.send({ id: newModule.id, message: 'Module created successfully' });
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
};

// Get all modules
const getAll = async (_req: Request, res: Response<ModuleResponse[]>) => {
  const moduleRepo = AppDataSource.getRepository(Module);
  const modules = await moduleRepo.find({
    relations: ['chapters', 'chapters.exercises'], // Fetch relations
  });

  const response: ModuleResponse[] = modules.map((module) => ({
    id: module.id,
    name: module.name,
    description: module.description,
    isActive: module.isActive,
    createdAt: module.createdAt,
    updatedAt: module.updatedAt,
    chapters: module.chapters.map((chapter) => ({
      id: chapter.id,
      name: chapter.name,
      description: chapter.description,
      order: chapter.order,
      isActive: chapter.isActive,
      fileUrl: chapter.fileUrl,
      createdAt: chapter.createdAt,
      updatedAt: chapter.updatedAt,
      exercises: chapter.exercises.map((exercise) => ({
        id: exercise.id,
        title: exercise.title,
        content: exercise.content,
        order: exercise.order,
        difficulty: exercise.difficulty,
        isActive: exercise.isActive,
        fileUrl: exercise.fileUrl,
        createdAt: exercise.createdAt,
        updatedAt: exercise.updatedAt,
      })),
    })),
  }));

  res.send(response);
};

// Get a module by ID
const getById = async (req: Request, res: Response<ModuleResponse>) => {
  const { id } = req.params;

  const moduleRepo = AppDataSource.getRepository(Module);
  const module = await moduleRepo.findOne({
    where: { id },
    relations: ['chapters', 'chapters.exercises'],
  });

  if (!module) {
    throw createHttpError(404, 'Module not found');
  }

  const response: ModuleResponse = {
    id: module.id,
    name: module.name,
    description: module.description,
    isActive: module.isActive,
    createdAt: module.createdAt,
    updatedAt: module.updatedAt,
    chapters: module.chapters.map((chapter) => ({
      id: chapter.id,
      name: chapter.name,
      description: chapter.description,
      order: chapter.order,
      isActive: chapter.isActive,
      fileUrl: chapter.fileUrl,
      createdAt: chapter.createdAt,
      updatedAt: chapter.updatedAt,
      exercises: chapter.exercises.map((exercise) => ({
        id: exercise.id,
        title: exercise.title,
        content: exercise.content,
        order: exercise.order,
        difficulty: exercise.difficulty,
        isActive: exercise.isActive,
        fileUrl: exercise.fileUrl,
        createdAt: exercise.createdAt,
        updatedAt: exercise.updatedAt,
      })),
    })),
  };

  res.send(response);
};

// Update a module by ID
const update = async (req: Request, res: Response<{ message: string }>) => {
  const { id } = req.params;
  const { name, description, isActive } = req.body;

  const moduleRepo = AppDataSource.getRepository(Module);
  const module = await moduleRepo.findOneBy({ id });

  if (!module) {
    throw createHttpError(404, 'Module not found');
  }

  if (name !== undefined) module.name = name;
  if (description !== undefined) module.description = description;
  if (isActive !== undefined) module.isActive = isActive;

  await moduleRepo.save(module);
  res.send({ message: 'Module updated successfully' });
};

// Helper to delete old files
const deleteFile = (filePath: string) => {
  const fullPath = path.join(__dirname, '../../../', filePath);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
};

const parseJsonArray = <T>(input: unknown, fieldName: string): T[] => {
  if (typeof input === 'string') {
    try {
      return JSON.parse(input) as T[];
    } catch {
      throw createHttpError(400, `${fieldName} must be a valid JSON array.`);
    }
  }

  if (!Array.isArray(input)) {
    throw createHttpError(400, `${fieldName} must be an array.`);
  }

  return input as T[];
};

const updateModuleWithChapterAndExercise = async (
  req: Request,
  res: Response<{ message: string }>
) => {
  await new Promise<void>((resolve, reject) => {
    upload.fields([
      { name: 'chapterFiles', maxCount: 10 },
      { name: 'exerciseFiles', maxCount: 20 },
    ])(req, res, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });

  const { id } = req.params;
  const { name, description, isActive } = req.body;

  // Parse chapters as ChapterUpdateBody[]
  const chapters: ChapterUpdateBody[] = parseJsonArray<ChapterUpdateBody>(
    req.body.chapters,
    'Chapters'
  );

  const chapterFiles = req.files?.['chapterFiles'] || [];
  const exerciseFiles = req.files?.['exerciseFiles'] || [];

  const moduleRepo = AppDataSource.getRepository(Module);
  const chapterRepo = AppDataSource.getRepository(Chapter);
  const exerciseRepo = AppDataSource.getRepository(Exercise);

  const module = await moduleRepo.findOne({
    where: { id },
    relations: ['chapters', 'chapters.exercises'],
  });

  if (!module) {
    throw createHttpError(404, 'Module not found');
  }

  // Update module fields
  if (name !== undefined) module.name = name;
  if (description !== undefined) module.description = description;
  if (isActive !== undefined) module.isActive = isActive;

  // Update chapters
  for (const [index, chapterData] of chapters.entries()) {
    const existingChapter = chapterData.id
      ? module.chapters.find((c) => c.id === chapterData.id)
      : undefined;

    if (existingChapter) {
      // Update existing chapter
      existingChapter.name = chapterData.name ?? existingChapter.name;
      existingChapter.description =
        chapterData.description ?? existingChapter.description;
      existingChapter.order = chapterData.order ?? existingChapter.order;
      existingChapter.isActive =
        chapterData.isActive ?? existingChapter.isActive;

      // Handle file update for the chapter
      const newChapterFile = chapterFiles[index]?.path;
      if (newChapterFile) {
        if (existingChapter.fileUrl) {
          deleteFile(existingChapter.fileUrl); // Delete old file
        }
        existingChapter.fileUrl = `uploads/${path.basename(newChapterFile)}`;
      }

      await chapterRepo.save(existingChapter);
    } else {
      // Add new chapter
      const newChapter = chapterRepo.create({
        name: chapterData.name,
        description: chapterData.description,
        order: chapterData.order,
        isActive: chapterData.isActive,
        module,
        fileUrl: chapterFiles[index]?.path
          ? `uploads/${path.basename(chapterFiles[index].path)}`
          : null,
      });

      await chapterRepo.save(newChapter);
    }

    // Update exercises for the chapter
    for (const [exerciseIndex, exerciseData] of (
      chapterData.exercises || []
    ).entries()) {
      const existingExercise = exerciseData.id
        ? existingChapter?.exercises.find((e) => e.id === exerciseData.id)
        : undefined;

      if (existingExercise) {
        // Update existing exercise
        existingExercise.title = exerciseData.title ?? existingExercise.title;
        existingExercise.content =
          exerciseData.content ?? existingExercise.content;
        existingExercise.order = exerciseData.order ?? existingExercise.order;
        existingExercise.difficulty =
          exerciseData.difficulty ?? existingExercise.difficulty;
        existingExercise.isActive =
          exerciseData.isActive ?? existingExercise.isActive;

        // Handle file update for the exercise
        const newExerciseFile = exerciseFiles[exerciseIndex]?.path;
        if (newExerciseFile) {
          if (existingExercise.fileUrl) {
            deleteFile(existingExercise.fileUrl); // Delete old file
          }
          existingExercise.fileUrl = `uploads/${path.basename(
            newExerciseFile
          )}`;
        }

        await exerciseRepo.save(existingExercise);
      } else {
        // Add new exercise
        const newExercise = exerciseRepo.create({
          title: exerciseData.title,
          content: exerciseData.content,
          order: exerciseData.order,
          difficulty: exerciseData.difficulty,
          isActive: exerciseData.isActive,
          chapter: existingChapter,
          fileUrl: exerciseFiles[exerciseIndex]?.path
            ? `uploads/${path.basename(exerciseFiles[exerciseIndex].path)}`
            : null,
        });

        await exerciseRepo.save(newExercise);
      }
    }
  }

  // Save updated module
  await moduleRepo.save(module);

  res.send({
    message: 'Module, chapters, and exercises updated successfully',
  });
};

// Delete a module by ID
const deleteModule = async (
  req: Request,
  res: Response<{ message: string }>
) => {
  const { id } = req.params;

  const moduleRepo = AppDataSource.getRepository(Module);
  const module = await moduleRepo.findOneBy({ id });

  if (!module) {
    throw createHttpError(404, 'Module not found');
  }

  await moduleRepo.remove(module);
  res.send({ message: 'Module deleted successfully' });
};

export default {
  create,
  getAll,
  getById,
  update,
  updateModuleWithChapterAndExercise,
  delete: deleteModule,
};
