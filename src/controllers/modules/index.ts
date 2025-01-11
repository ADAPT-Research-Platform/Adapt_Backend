import type { Request, Response } from 'express';
import createHttpError from 'http-errors';

import { AppDataSource } from '../../data-source';
import { Module } from '../../entities/module';

import type { ModuleResponse } from '../../types/routes/modules';
import { Progress } from "../../entities/progress";

/*
// Utility function to upload images to the server or cloud
// This saves images locally, but you can be replaced.
function uploadImageToCloudOrServer(imagePath: fs.PathLike): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const uploadDir = path.join(__dirname, '../../../uploads/images');

      // Ensure the directory exists
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const destination = path.join(
        uploadDir,
        path.basename(imagePath.toString())
      );

      // Copy the file to the uploads directory
      fs.copyFileSync(imagePath, destination);

      // Resolve the mock URL
      resolve(`/uploads/images/${path.basename(imagePath.toString())}`);
    } catch (err) {
      reject(err);
    }
  });
}

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
  // Apply the multer middleware for file uploads
  await new Promise<void>((resolve, reject) => {
    upload.fields([
      { name: 'chapterFiles', maxCount: 50 },
      { name: 'exerciseFiles', maxCount: 100 },
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

  // Separate markdown and image files from chapterFiles and exerciseFiles
  const markdownFiles: Express.Multer.File[] = [];
  const imageFiles: { path: string }[] = [];

  [...chapterFiles, ...exerciseFiles].forEach((file) => {
    if (file.mimetype === 'text/markdown' || file.mimetype === 'text/plain') {
      markdownFiles.push(file);
    } else if (file.mimetype.startsWith('image/')) {
      imageFiles.push(file);
    }
  });

  if (markdownFiles.length === 0) {
    throw createHttpError(400, 'At least one markdown file is required');
  }

  try {
    const {
      description,
      name,
      isActive = true,
      chapters,
    } = validateModuleCreateBody(req.body);

    // Process each markdown file
    for (const markdownFile of markdownFiles) {
      const markdownPath = markdownFile.path;
      let markdownContent = fs.readFileSync(markdownPath, 'utf-8');

      // Extract image links from markdown content
      const imageLinks = [
        ...markdownContent.matchAll(/!\[.*?\]\((.*?)\)/g),
      ].map((match) => match[1]);

      const uploadedImageUrls = await Promise.all(
        imageLinks.map(async (imagePath, index) => {
          const absolutePath = path.resolve(imagePath);
          if (fs.existsSync(absolutePath)) {
            return uploadImageToCloudOrServer(absolutePath);
          } else if (imageFiles[index]) {
            // Upload corresponding image from `imageFiles`
            const uploadedUrl = await uploadImageToCloudOrServer(
              imageFiles[index].path
            );
            return uploadedUrl;
          } else {
            throw new Error(`Image not found: ${imagePath}`);
          }
        })
      );

      // Replace local image paths with uploaded image URLs in the markdown content
      imageLinks.forEach((imagePath, index) => {
        markdownContent = markdownContent.replace(
          imagePath,
          uploadedImageUrls[index]
        );
      });

      // Save the updated markdown file
      // Overwrite the original markdown file with updated content
      fs.writeFileSync(markdownPath, markdownContent, 'utf-8');
    }

    const queryRunner = AppDataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const moduleRepo = queryRunner.manager.getRepository(Module);
      const fileRepo = queryRunner.manager.getRepository(File);

      // Check for module name uniqueness
      const moduleExists = await moduleRepo.exist({ where: { name } });
      if (moduleExists) {
        throw createHttpError(409, 'Module name already exists');
      }

      // Create and save the module
      const newModule = new Module();
      if (name === undefined) {
        throw createHttpError(400, 'Module name is required');
      }
      newModule.name = name;
      newModule.description = description ?? null;
      newModule.isActive = isActive;
      await queryRunner.manager.save(newModule);

      // Save chapters and exercises
      if (!chapters) {
        throw createHttpError(400, 'Chapters are required');
      }
      for (let i = 0; i < chapters.length; i++) {
        const chapterData = chapters[i];
        const chapterFileUploads = chapterFiles.slice(i * 10, (i + 1) * 10);

        const newChapter = new Chapter();
        newChapter.name = chapterData.name;
        newChapter.description = chapterData.description ?? null;
        newChapter.order = chapterData.order;
        newChapter.isActive = chapterData.isActive ?? true;
        newChapter.module = newModule;
        await queryRunner.manager.save(newChapter);

        // Save chapter files
        if (chapterFileUploads.length > 0) {
          for (const file of chapterFileUploads) {
            const newFile = new File();
            newFile.filePath = file.path;
            newFile.chapter = newChapter;
            await fileRepo.save(newFile);
          }
        }

        // Save exercises
        for (let j = 0; j < chapterData.exercises.length; j++) {
          const exerciseData = chapterData.exercises[j];
          const exerciseFileUploads = exerciseFiles.slice(j * 20, (j + 1) * 20);

          const newExercise = new Section();
          newExercise.title = exerciseData.title;
          newExercise.content = exerciseData.content ?? null;
          newExercise.order = exerciseData.order;
          newExercise.difficulty = exerciseData.difficulty ?? 'Medium';
          newExercise.isActive = exerciseData.isActive ?? true;
          newExercise.chapter = newChapter;
          await queryRunner.manager.save(newExercise);

          // Save exercise files
          if (exerciseFileUploads.length > 0) {
            for (const file of exerciseFileUploads) {
              const newFile = new File();
              newFile.filePath = file.path;
              newFile.exercise = newExercise;
              await fileRepo.save(newFile);
            }
          }
        }
      }

      await queryRunner.commitTransaction();
      res
        .status(201)
        .json({ id: newModule.id, message: 'Module created successfully' });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof Error) {
        throw createHttpError(500, `Error creating module: ${error.message}`);
      } else {
        throw createHttpError(500, 'Error creating module');
      }
    } finally {
      await queryRunner.release();
    }
  } catch (error) {
    if (error instanceof Error) {
      throw createHttpError(
        500,
        `Error processing markdown file: ${error.message}`
      );
    } else {
      throw createHttpError(500, 'Error processing markdown file');
    }
  }
};

// // Multer configuration for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadPath = path.join(__dirname, '../../../uploads');
//     if (!fs.existsSync(uploadPath)) {
//       fs.mkdirSync(uploadPath, { recursive: true });
//     }
//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     const uniqueName = `${Date.now()}-${file.originalname}`;
//     cb(null, uniqueName);
//   },
// });

// const upload = multer({
//   storage,
//   fileFilter: (req, file, cb) => {
//     // Acceptable file extensions
//     const fileTypes = /md|jpeg|jpg|png|gif/;

//     // Check file extension
//     const extName = fileTypes.test(
//       path.extname(file.originalname).toLowerCase()
//     );

//     // Check MIME type
//     const mimeType =
//       file.mimetype === 'text/markdown' ||
//       file.mimetype === 'text/plain' ||
//       file.mimetype.startsWith('image/');

//     if (extName && mimeType) {
//       cb(null, true);
//     } else {
//       cb(new Error('Only .md, .jpg, .jpeg, .png, and .gif files are allowed'));
//     }
//   },
// });

// // Updated `create` function to handle file uploads
// const create = async (
//   req: TypedRequestBody<ModuleCreateBody>,
//   res: Response
// ) => {
//   // Apply the multer middleware for file uploads
//   await new Promise<void>((resolve, reject) => {
//     upload.fields([
//       { name: 'chapterFiles', maxCount: 50 },
//       { name: 'exerciseFiles', maxCount: 100 },
//     ])(req, res, (err) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve();
//       }
//     });
//   });

//   // Access uploaded files
//   const chapterFiles = req.files?.['chapterFiles'] || [];
//   const exerciseFiles = req.files?.['exerciseFiles'] || [];

//   const {
//     name,
//     description,
//     isActive = true,
//     chapters,
//   } = validateModuleCreateBody(req.body);

//   const queryRunner = AppDataSource.createQueryRunner();

//   await queryRunner.connect();
//   await queryRunner.startTransaction();

//   try {
//     const moduleRepo = queryRunner.manager.getRepository(Module);
//     const fileRepo = queryRunner.manager.getRepository(File);

//     // Check for module name uniqueness
//     const moduleExists = await moduleRepo.exist({ where: { name } });
//     if (moduleExists) {
//       throw createHttpError(409, 'Module name already exists');
//     }

//     // Create and save the module
//     const newModule = new Module();
//     newModule.name = name;
//     newModule.description = description ?? null;
//     newModule.isActive = isActive;
//     await queryRunner.manager.save(newModule);

//     // Save chapters and exercises
//     for (let i = 0; i < chapters.length; i++) {
//       const chapterData = chapters[i];
//       const chapterFileUploads = chapterFiles.slice(i * 10, (i + 1) * 10);

//       const newChapter = new Chapter();
//       newChapter.name = chapterData.name;
//       newChapter.description = chapterData.description ?? null;
//       newChapter.order = chapterData.order;
//       newChapter.isActive = chapterData.isActive ?? true;
//       newChapter.module = newModule;
//       await queryRunner.manager.save(newChapter);

//       // Save chapter files
//       if (chapterFileUploads.length > 0) {
//         for (const file of chapterFileUploads) {
//           const newFile = new File();
//           newFile.filePath = file.path;
//           newFile.chapter = newChapter;
//           await fileRepo.save(newFile);
//         }
//       }

//       // Save exercises
//       for (let j = 0; j < chapterData.exercises.length; j++) {
//         const exerciseData = chapterData.exercises[j];
//         const exerciseFileUploads = exerciseFiles.slice(j * 20, (j + 1) * 20);

//         const newExercise = new Exercise();
//         newExercise.title = exerciseData.title;
//         newExercise.content = exerciseData.content ?? null;
//         newExercise.order = exerciseData.order;
//         newExercise.difficulty = exerciseData.difficulty ?? 'Medium';
//         newExercise.isActive = exerciseData.isActive ?? true;
//         newExercise.chapter = newChapter;
//         await queryRunner.manager.save(newExercise);

//         // Save exercise files
//         if (exerciseFileUploads.length > 0) {
//           for (const file of exerciseFileUploads) {
//             const newFile = new File();
//             newFile.filePath = file.path;
//             newFile.exercise = newExercise;
//             await fileRepo.save(newFile);
//           }
//         }
//       }
//     }

//     await queryRunner.commitTransaction();
//     res
//       .status(201)
//       .json({ id: newModule.id, message: 'Module created successfully' });
//   } catch (error) {
//     await queryRunner.rollbackTransaction();
//     if (error instanceof Error) {
//       throw createHttpError(500, `Error creating module: ${error.message}`);
//     } else {
//       throw createHttpError(500, 'Error creating module');
//     }
//   } finally {
//     await queryRunner.release();
//   }
// };*/

// Helper function to get user ID
const getUserId = (req: Request): number => {
  if (!req.user || !req.user.id) {
    throw createHttpError(401, 'User not authenticated');
  }
  return req.user.id;
};

const getAllModules = async (_req: Request, res: Response) => {
  const userId = getUserId(_req);
  const moduleRepo = AppDataSource.getRepository(Module);

  // Fetch all modules with chapters and sections
  const modules = await moduleRepo.find({
    where: { isActive: true },
    relations: ['chapters', 'chapters.sections'],
  });

  // Calculate progress for each module and chapter
  const progressRepo = AppDataSource.getRepository(Progress);

  // Fetch module progress
  const moduleProgress = await progressRepo
      .createQueryBuilder('progress')
      .select('progress.moduleId', 'moduleId')
      .addSelect('AVG(progress.value)', 'moduleProgress')
      .where('progress.userId = :userId', { userId: userId })
      .groupBy('progress.moduleId')
      .getRawMany();

  // Fetch chapter progress
  const chapterProgress = await progressRepo
      .createQueryBuilder('progress')
      .select('progress.chapterId', 'chapterId')
      .addSelect('AVG(progress.value)', 'chapterProgress')
      .where('progress.userId = :userId', { userId: userId })
      .groupBy('progress.chapterId')
      .getRawMany();

  // Create a map for fast lookup
  const moduleProgressMap = new Map<number, number>();
  moduleProgress.forEach((item) =>
      moduleProgressMap.set(item.moduleId, parseFloat(item.moduleProgress))
  );

  const chapterProgressMap = new Map<number, number>();
  chapterProgress.forEach((item) =>
      chapterProgressMap.set(item.chapterId, parseFloat(item.chapterProgress))
  );

  // Transform the response
  const response: ModuleResponse[] = modules.map((module) => ({
    id: module.id,
    progress: moduleProgressMap.get(module.id) || 0, // Use module progress map
    chapters: module.chapters.map((chapter) => ({
      id: chapter.id,
      title: chapter.title,
      progress: chapterProgressMap.get(chapter.id) || 0, // Use chapter progress map
      sections: chapter.sections.map((section) => ({
        id: section.id,
        updatedAt: section.updatedAt,
        title: section.title,
        folderUrl: section.folderUrl,
        isExercise: section.isExercise,
      })),
    })),
  }));

  res.send(response);
};

// Get all modules
const getAll = async (_req: Request, res: Response<ModuleResponse[]>) => {
  const moduleRepo = AppDataSource.getRepository(Module);
  const modules = await moduleRepo.find({
    where: { isActive: true },
    relations: [
      'chapters',
      'chapters.sections', // Include chapter files
    ],
  });

  const response: ModuleResponse[] = modules.map((module) => ({
    id: module.id,
    progress: 0,
    chapters: module.chapters.map((chapter) => ({
      id: chapter.id,
      title: chapter.title,
      progress: 0,
      sections: chapter.sections.map((section) => ({
        id: section.id,
        updatedAt: section.updatedAt,
        title: section.title,
        folderUrl: section.folderUrl, // Map exercise files
        isExercise: section.isExercise
      })),
    })),
  }));

  res.send(response);
};

// Get a module by ID
const getById = async (req: Request, res: Response<ModuleResponse>) => {
  const { id } = req.params;
  const moduleId: number = parseInt(id, 10);

  const moduleRepo = AppDataSource.getRepository(Module);
  const module = await moduleRepo.findOne({
    where: { id: moduleId },
    relations: [
      'chapters',
      'chapters.sections', // Include chapter files
    ],
  });

  if (!module) {
    throw createHttpError(404, 'Module not found');
  }

  const response: ModuleResponse = {
    id: module.id,
    progress: 0,
    chapters: module.chapters.map((chapter) => ({
      id: chapter.id,
      title: chapter.title,
      progress: 0,
      sections: chapter.sections.map((section) => ({
        id: section.id,
        updatedAt: section.updatedAt,
        title: section.title,
        folderUrl: section.folderUrl, // Map exercise files
        isExercise: section.isExercise
      })),
    })),
  };

  res.send(response);
};

/*
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
  // Use path.resolve to get the absolute path to the uploads folder
  const uploadFolder = path.resolve(__dirname, '../../../uploads'); // Adjusted to root/uploads
  const fullPath = path.join(uploadFolder, path.basename(filePath)); // Combines folder + filename

  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
    console.log(`Deleted file: ${fullPath}`);
  } else {
    console.warn(`File not found: ${fullPath}`);
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
      { name: 'chapterFiles', maxCount: 50 },
      { name: 'exerciseFiles', maxCount: 100 },
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

  const chapters: ChapterUpdateBody[] = parseJsonArray<ChapterUpdateBody>(
    req.body.chapters,
    'Chapters'
  );

  const chapterFiles = req.files?.['chapterFiles'] || [];
  const exerciseFiles = req.files?.['exerciseFiles'] || [];

  const moduleRepo = AppDataSource.getRepository(Module);
  const chapterRepo = AppDataSource.getRepository(Chapter);
  const exerciseRepo = AppDataSource.getRepository(Section);
  const fileRepo = AppDataSource.getRepository(File);

  const module = await moduleRepo.findOne({
    where: { id },
    relations: [
      'chapters',
      'chapters.files',
      'chapters.exercises',
      'chapters.exercises.files',
    ],
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
    let existingChapter = chapterData.id
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

      await chapterRepo.save(existingChapter);

      // Delete old chapter files from database and filesystem
      const oldFiles = await fileRepo.find({
        where: { chapter: { id: existingChapter.id } },
      });
      for (const oldFile of oldFiles) {
        deleteFile(oldFile.filePath); // Delete physical file
        await fileRepo.remove(oldFile); // Delete file record
      }

      // Save new chapter files
      const newChapterFiles = chapterFiles.slice(index * 10, (index + 1) * 10);
      for (const file of newChapterFiles) {
        const newFile = new File();
        newFile.filePath = file.path;
        newFile.chapter = existingChapter;
        await fileRepo.save(newFile);
      }
    } else {
      // Add new chapter
      const newChapter = chapterRepo.create({
        name: chapterData.name,
        description: chapterData.description,
        order: chapterData.order,
        isActive: chapterData.isActive,
        module,
      });

      await chapterRepo.save(newChapter);

      // Save new chapter files
      const newChapterFiles = chapterFiles.slice(index * 10, (index + 1) * 10);
      for (const file of newChapterFiles) {
        const newFile = new File();
        newFile.filePath = file.path;
        newFile.chapter = newChapter;
        await fileRepo.save(newFile);
      }
      existingChapter = newChapter;
    }

    // Update exercises for the chapter
    for (const [exerciseIndex, exerciseData] of (
      chapterData.exercises || []
    ).entries()) {
      // Ensure existingChapter is defined
      if (!existingChapter) {
        throw createHttpError(
          500,
          'Existing chapter is undefined during exercise update.'
        );
      }

      // Ensure exercises array exists
      existingChapter.exercises = existingChapter.exercises || [];

      const existingExercise = exerciseData.id
        ? existingChapter.exercises.find((e) => e.id === exerciseData.id)
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

        await exerciseRepo.save(existingExercise);

        // Delete old exercise files
        const oldExerciseFiles = await fileRepo.find({
          where: { exercise: { id: existingExercise.id } },
        });
        for (const oldFile of oldExerciseFiles) {
          deleteFile(oldFile.filePath);
          await fileRepo.remove(oldFile);
        }

        // Save new exercise files
        const newExerciseFiles = exerciseFiles.slice(
          exerciseIndex * 20,
          (exerciseIndex + 1) * 20
        );
        for (const file of newExerciseFiles) {
          const newFile = new File();
          newFile.filePath = file.path;
          newFile.exercise = existingExercise;
          await fileRepo.save(newFile);
        }
      } else {
        // Add new exercise
        const newExercise = exerciseRepo.create({
          title: exerciseData.title,
          content: exerciseData.content,
          order: exerciseData.order,
          difficulty: exerciseData.difficulty,
          isActive: exerciseData.isActive,
          chapter: existingChapter,
        });

        await exerciseRepo.save(newExercise);

        // Save new exercise files
        const newExerciseFiles = exerciseFiles.slice(
          exerciseIndex * 20,
          (exerciseIndex + 1) * 20
        );
        for (const file of newExerciseFiles) {
          const newFile = new File();
          newFile.filePath = file.path;
          newFile.exercise = newExercise;
          await fileRepo.save(newFile);
        }
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
  const fileRepo = AppDataSource.getRepository(File);

  // Find the module with all related data
  const module = await moduleRepo.findOne({
    where: { id },
    relations: [
      'chapters',
      'chapters.files',
      'chapters.exercises',
      'chapters.exercises.files',
    ],
  });

  if (!module) {
    throw createHttpError(404, 'Module not found');
  }

  try {
    // Delete files associated with chapters and exercises
    for (const chapter of module.chapters) {
      // Delete chapter files
      for (const file of chapter.files) {
        deleteFile(file.filePath); // Delete from filesystem
        await fileRepo.remove(file); // Delete file record
      }

      // Delete exercise files
      for (const exercise of chapter.exercises) {
        for (const file of exercise.files) {
          deleteFile(file.filePath); // Delete from filesystem
          await fileRepo.remove(file); // Delete file record
        }
      }
    }

    // Finally, remove the module
    await moduleRepo.remove(module);

    res.send({ message: 'Module and associated files deleted successfully' });
  } catch (error) {
    throw createHttpError(500, 'Error deleting module and files');
  }
};
*/

export default {
  // create,
  getAllModules,
  getAll,
  getById,
  // update,
  // updateModuleWithChapterAndExercise,
  // delete: deleteModule,
};
