-- Table: user
INSERT INTO "user" ("username", "email", "hashPassword", "salt") VALUES ('user1', 'user1@example.com', 'hashedpassword1', 'salt1');
INSERT INTO "user" ("username", "email", "hashPassword", "salt") VALUES ('user2', 'user2@example.com', 'hashedpassword2', 'salt2');
INSERT INTO "user" ("username", "email", "hashPassword", "salt") VALUES ('user3', 'user3@example.com', 'hashedpassword3', 'salt3');
INSERT INTO "user" ("username", "email", "hashPassword", "salt") VALUES ('user4', 'user4@example.com', 'hashedpassword4', 'salt4');
INSERT INTO "user" ("username", "email", "hashPassword", "salt") VALUES ('user5', 'user5@example.com', 'hashedpassword5', 'salt5');

-- Table: module
INSERT INTO "module" ("isActive") VALUES (true);
INSERT INTO "module" ("isActive") VALUES (true);
INSERT INTO "module" ("isActive") VALUES (true);
INSERT INTO "module" ("isActive") VALUES (true);
INSERT INTO "module" ("isActive") VALUES (true);

-- Table: chapter
INSERT INTO "chapter" ("moduleId", "title", "isActive") VALUES (1, 'Chapter 1 - Basics', true);
INSERT INTO "chapter" ("moduleId", "title", "isActive") VALUES (1, 'Chapter 2 - Intermediate', true);
INSERT INTO "chapter" ("moduleId", "title", "isActive") VALUES (2, 'Chapter 1 - Introduction', true);
INSERT INTO "chapter" ("moduleId", "title", "isActive") VALUES (3, 'Chapter 1 - Overview', true);
INSERT INTO "chapter" ("moduleId", "title", "isActive") VALUES (4, 'Chapter 1 - Advanced', true);
INSERT INTO "chapter" ("moduleId", "title", "isActive") VALUES (5, 'Simple', true);
INSERT INTO "chapter" ("moduleId", "title", "isActive") VALUES (5, 'Advanced', true);

-- Table: section
INSERT INTO "section" ("chapterId", "folderUrl", "title", "isExercise", "isActive") VALUES (1, 'http://fileserver/chapter1/section1', 'Section 1 - Getting Started', true, true);
INSERT INTO "section" ("chapterId", "folderUrl", "title", "isExercise", "isActive") VALUES (1, 'http://fileserver/chapter1/section2', 'Section 2 - First Steps', false, true);
INSERT INTO "section" ("chapterId", "folderUrl", "title", "isExercise", "isActive") VALUES (2, 'http://fileserver/chapter2/section1', 'Section 1 - Advanced Topics', true, true);
INSERT INTO "section" ("chapterId", "folderUrl", "title", "isExercise", "isActive") VALUES (3, 'http://fileserver/chapter3/section1', 'Section 1 - Overview', false, true);
INSERT INTO "section" ("chapterId", "folderUrl", "title", "isExercise", "isActive") VALUES (4, 'http://fileserver/chapter4/section1', 'Section 1 - Exercises', true, true);
INSERT INTO "section" ("chapterId", "folderUrl", "title", "isExercise", "isActive") VALUES (6, 'http://137.248.186.50:8001/app/uploads/Module_01/Chapter_01/Section_01', 'Hallo und herzlich willkommen!', false, true);
INSERT INTO "section" ("chapterId", "folderUrl", "title", "isExercise", "isActive") VALUES (6, 'http://137.248.186.50:8001/app/uploads/Module_01/Chapter_01/Section_02', 'Zahlen und Fakten – Angst weltweit', false, true);
INSERT INTO "section" ("chapterId", "folderUrl", "title", "isExercise", "isActive") VALUES (6, 'http://137.248.186.50:8001/app/uploads/Module_01/Chapter_01/Section_03', 'Max und Hanna', false, true);
INSERT INTO "section" ("chapterId", "folderUrl", "title", "isExercise", "isActive") VALUES (6, 'http://137.248.186.50:8001/app/uploads/Module_01/Chapter_01/Section_04', 'Grundlagen der App', false, true);
INSERT INTO "section" ("chapterId", "folderUrl", "title", "isExercise", "isActive") VALUES (6, 'http://137.248.186.50:8001/app/uploads/Module_01/Chapter_01/Section_05', 'Ein kurzer Einstieg', false, true);
INSERT INTO "section" ("chapterId", "folderUrl", "title", "isExercise", "isActive") VALUES (6, 'http://137.248.186.50:8001/app/uploads/Module_01/Chapter_01/Section_06', 'Meine Ängste', true, true);
INSERT INTO "section" ("chapterId", "folderUrl", "title", "isExercise", "isActive") VALUES (7, 'http://137.248.186.50:8001/app/uploads/Module_01/Chapter_02/Section_01', 'Warum Angst wichtig ist', false, true);
INSERT INTO "section" ("chapterId", "folderUrl", "title", "isExercise", "isActive") VALUES (7, 'http://137.248.186.50:8001/app/uploads/Module_01/Chapter_02/Section_02', 'Wann Angst zu viel wird', false, true);
INSERT INTO "section" ("chapterId", "folderUrl", "title", "isExercise", "isActive") VALUES (7, 'http://137.248.186.50:8001/app/uploads/Module_01/Chapter_02/Section_03', 'Ist meine Angst noch normal?', false, true);
INSERT INTO "section" ("chapterId", "folderUrl", "title", "isExercise", "isActive") VALUES (7, 'http://137.248.186.50:8001/app/uploads/Module_01/Chapter_02/Section_04', 'Und jetzt?', false, true);
INSERT INTO "section" ("chapterId", "folderUrl", "title", "isExercise", "isActive") VALUES (7, 'http://137.248.186.50:8001/app/uploads/Module_01/Chapter_02/Section_05', 'Komponenten der Angst', true, true);
INSERT INTO "section" ("chapterId", "folderUrl", "title", "isExercise", "isActive") VALUES (7, 'http://137.248.186.50:8001/app/uploads/Module_01/Chapter_02/Section_06', 'Was vermittle ich meinem Kind?', true, true);
INSERT INTO "section" ("chapterId", "folderUrl", "title", "isExercise", "isActive") VALUES (7, 'http://137.248.186.50:8001/app/uploads/Module_01/Chapter_02/Section_07', 'Was kann ich tun?', false, true);
INSERT INTO "section" ("chapterId", "folderUrl", "title", "isExercise", "isActive") VALUES (7, 'http://137.248.186.50:8001/app/uploads/Module_01/Chapter_02/Section_08', 'Mein Fazit', true, true);

-- Table: progress
INSERT INTO "progress" ("userId", "moduleId", "chapterId", "sectionId", "value") VALUES (1, 1, 1, 1, 75.5);
INSERT INTO "progress" ("userId", "moduleId", "chapterId", "sectionId", "value") VALUES (2, 1, 1, 2, 45.0);
INSERT INTO "progress" ("userId", "moduleId", "chapterId", "sectionId", "value") VALUES (3, 2, 3, 3, 15.5);
INSERT INTO "progress" ("userId", "moduleId", "chapterId", "sectionId") VALUES (4, 3, 4, 4);
INSERT INTO "progress" ("userId", "moduleId", "chapterId", "sectionId") VALUES (5, 4, 5, 5);
INSERT INTO "progress" ("userId", "moduleId", "chapterId", "sectionId", "value") VALUES (6, 5, 6, 6, 75.5);
INSERT INTO "progress" ("userId", "moduleId", "chapterId", "sectionId", "value") VALUES (6, 5, 6, 7, 45.0);
INSERT INTO "progress" ("userId", "moduleId", "chapterId", "sectionId", "value") VALUES (6, 5, 6, 8, 45.0);
INSERT INTO "progress" ("userId", "moduleId", "chapterId", "sectionId", "value") VALUES (6, 5, 7, 12, 20.5);
INSERT INTO "progress" ("userId", "moduleId", "chapterId", "sectionId", "value") VALUES (6, 5, 7, 13, 65.5);
INSERT INTO "progress" ("userId", "moduleId", "chapterId", "sectionId", "value") VALUES (6, 5, 7, 14, 35.5);


-- Table: comment
INSERT INTO "comment" ("parentId", "userId", "sectionId", "text") VALUES (NULL, 1, 1, 'This is a great section!');
INSERT INTO "comment" ("parentId", "userId", "sectionId", "text") VALUES (1, 2, 1, 'I agree with you!');
INSERT INTO "comment" ("parentId", "userId", "sectionId", "text") VALUES (NULL, 3, 2, 'This is a tough topic.');
INSERT INTO "comment" ("parentId", "userId", "sectionId", "text") VALUES (3, 4, 2, 'But it is very informative.');
INSERT INTO "comment" ("parentId", "userId", "sectionId", "text") VALUES (NULL, 5, 3, 'Looking forward to more content.');

-- Table: mood
INSERT INTO "mood" ("userId", "feeling", "motivation") VALUES (6, 8, 7);
INSERT INTO "mood" ("userId", "feeling", "motivation") VALUES (6, 7, 6);
INSERT INTO "mood" ("userId", "feeling", "motivation") VALUES (6, 9, 8);
INSERT INTO "mood" ("userId", "feeling", "motivation") VALUES (6, 6, 5);
INSERT INTO "mood" ("userId", "feeling", "motivation") VALUES (6, 7, 7);