import type { Response, Request } from 'express';
import createHttpError from 'http-errors';

import { AppDataSource } from '../../data-source';
import { Module } from '../../entities/module';
import { Chapter } from '../../entities/chapter';
import { Exercise } from '../../entities/exercise';
import type { ModuleCreateBody, ModuleResponse } from '../../types/routes/modules';
import { validateModuleCreateBody } from './validators';

const create = async (
  req: TypedRequestBody<ModuleCreateBody>,
  res: Response
) => {
  // Validate the incoming request body
  const {
    name,
    description,
    isActive = true,
    chapters,
  } = validateModuleCreateBody(req.body);

  // Create a query runner to control the transactions
  const queryRunner = AppDataSource.createQueryRunner();

  // Connect the query runner to the database and start the transaction
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

    // Create the new module
    const newModule = new Module();
    newModule.name = name;
    newModule.description = description ?? null;
    newModule.isActive = isActive;

    // Save the module first to generate its ID
    await queryRunner.manager.save(newModule);

    // Loop through chapters and save them
    for (const chapterData of chapters) {
      const {
        name: chapterName,
        description: chapterDescription,
        order,
        isActive: chapterActive = true,
        fileUrl,
        exercises,
      } = chapterData;

      const newChapter = new Chapter();
      newChapter.name = chapterName;
      newChapter.description = chapterDescription ?? null;
      newChapter.order = order;
      newChapter.isActive = chapterActive;
      newChapter.fileUrl = fileUrl ?? null;
      newChapter.module = newModule; // Associate with the module

      // Save the chapter to generate its ID
      await queryRunner.manager.save(newChapter);

      // Loop through exercises and save them
      for (const exerciseData of exercises) {
        const {
          title,
          content,
          order: exerciseOrder,
          difficulty = 'Medium',
          isActive: exerciseActive = true,
          fileUrl: exerciseFileUrl,
        } = exerciseData;

        const newExercise = new Exercise();
        newExercise.title = title;
        
        newExercise.content = content ?? null;
        newExercise.order = exerciseOrder;
        newExercise.difficulty = difficulty;
        newExercise.isActive = exerciseActive;
        newExercise.fileUrl = exerciseFileUrl ?? null;
        newExercise.chapter = newChapter; // Associate with the chapter

        await queryRunner.manager.save(newExercise);
      }
    }

    // Commit the transaction if no exceptions occurred
    await queryRunner.commitTransaction();

    res.send(newModule.id); // Return the ID of the created module
  } catch (err) {
    // Rollback the transaction in case of an exception
    await queryRunner.rollbackTransaction();
    throw err;
  } finally {
    // Release the query runner to free the connection
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

// Delete a module by ID
const deleteModule = async (req: Request, res: Response<{ message: string }>) => {
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
