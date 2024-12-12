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
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());

    // Check MIME type
    const mimeType = file.mimetype === 'text/markdown' || file.mimetype === 'text/plain' ||
      file.mimetype.startsWith('image/');

    if (extName && mimeType) {
      cb(null, true);
    } else {
      cb(new Error('Only .md, .jpg, .jpeg, .png, and .gif files are allowed'));
    }
  },
});

// Updated `create` function to handle file uploads
const create = (req: TypedRequestBody<ModuleCreateBody>, res: Response) => {
  // Apply the multer middleware
  upload.fields([
    { name: 'chapterFiles', maxCount: 10 },
    { name: 'exerciseFiles', maxCount: 20 },
  ])(req, res, async (err) => {
    if (err) {
      return res.status(400).send({ message: err.message });
    }

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
  });
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
  delete: deleteModule,
};
