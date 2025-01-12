-- Table: user  -- Password apple123
INSERT INTO "user" ("username", "email", "hashPassword", "salt", "role") VALUES ('LeonieKrol', 'user1@example.com', '$2a$12$sY6zwIplP07j07z5lLuhYOzLi4ERVjWnwhjKgwgWq.Pi1JUhc7bIq', '$2a$12$sY6zwIplP07j07z5lLuhYO','admin');
INSERT INTO "user" ("username", "email", "hashPassword", "salt") VALUES ('BinayakAdhikari', 'user2@example.com', '$2a$12$sY6zwIplP07j07z5lLuhYOzLi4ERVjWnwhjKgwgWq.Pi1JUhc7bIq', '$2a$12$sY6zwIplP07j07z5lLuhYO');
INSERT INTO "user" ("username", "email", "hashPassword", "salt", "isVerified") VALUES ('RisithPerera', 'risithmarshall@gmail.com', '$2a$12$sY6zwIplP07j07z5lLuhYOzLi4ERVjWnwhjKgwgWq.Pi1JUhc7bIq', '$2a$12$sY6zwIplP07j07z5lLuhYO', true);

-- Table: module
INSERT INTO "module" ("isActive") VALUES (true);

-- Table: chapter
INSERT INTO "chapter" ("moduleId", "title", "isActive") VALUES (1, 'Willkommen', true);
INSERT INTO "chapter" ("moduleId", "title", "isActive") VALUES (1, 'Angst', true);

-- Table: section
INSERT INTO "section" ("chapterId", "folderUrl", "title", "isExercise", "isActive") VALUES (1, 'app/uploads/Module_01/Chapter_01/Section_01', 'Hallo und herzlich willkommen!', false, true);
INSERT INTO "section" ("chapterId", "folderUrl", "title", "isExercise", "isActive") VALUES (1, 'app/uploads/Module_01/Chapter_01/Section_02', 'Zahlen und Fakten – Angst weltweit', false, true);
INSERT INTO "section" ("chapterId", "folderUrl", "title", "isExercise", "isActive") VALUES (1, 'app/uploads/Module_01/Chapter_01/Section_03', 'Max und Hanna', false, true);
INSERT INTO "section" ("chapterId", "folderUrl", "title", "isExercise", "isActive") VALUES (1, 'app/uploads/Module_01/Chapter_01/Section_04', 'Grundlagen der App', false, true);
INSERT INTO "section" ("chapterId", "folderUrl", "title", "isExercise", "isActive") VALUES (1, 'app/uploads/Module_01/Chapter_01/Section_05', 'Ein kurzer Einstieg', false, true);
INSERT INTO "section" ("chapterId", "folderUrl", "title", "isExercise", "isActive") VALUES (1, 'app/uploads/Module_01/Chapter_01/Section_06', 'Meine Ängste', true, true);
INSERT INTO "section" ("chapterId", "folderUrl", "title", "isExercise", "isActive") VALUES (2, 'app/uploads/Module_01/Chapter_02/Section_01', 'Warum Angst wichtig ist', false, true);
INSERT INTO "section" ("chapterId", "folderUrl", "title", "isExercise", "isActive") VALUES (2, 'app/uploads/Module_01/Chapter_02/Section_02', 'Wann Angst zu viel wird', false, true);
INSERT INTO "section" ("chapterId", "folderUrl", "title", "isExercise", "isActive") VALUES (2, 'app/uploads/Module_01/Chapter_02/Section_03', 'Ist meine Angst noch normal?', false, true);
INSERT INTO "section" ("chapterId", "folderUrl", "title", "isExercise", "isActive") VALUES (2, 'app/uploads/Module_01/Chapter_02/Section_04', 'Und jetzt?', false, true);
INSERT INTO "section" ("chapterId", "folderUrl", "title", "isExercise", "isActive") VALUES (2, 'app/uploads/Module_01/Chapter_02/Section_05', 'Komponenten der Angst', true, true);
INSERT INTO "section" ("chapterId", "folderUrl", "title", "isExercise", "isActive") VALUES (2, 'app/uploads/Module_01/Chapter_02/Section_06', 'Was vermittle ich meinem Kind?', true, true);
INSERT INTO "section" ("chapterId", "folderUrl", "title", "isExercise", "isActive") VALUES (2, 'app/uploads/Module_01/Chapter_02/Section_07', 'Was kann ich tun?', false, true);
INSERT INTO "section" ("chapterId", "folderUrl", "title", "isExercise", "isActive") VALUES (2, 'app/uploads/Module_01/Chapter_02/Section_08', 'Mein Fazit', true, true);

-- Table: progress
INSERT INTO "progress" ("userId", "moduleId", "chapterId", "sectionId", "value") VALUES (3, 1, 1, 1, 75.5);
INSERT INTO "progress" ("userId", "moduleId", "chapterId", "sectionId", "value") VALUES (3, 1, 1, 2, 45.0);
INSERT INTO "progress" ("userId", "moduleId", "chapterId", "sectionId", "value") VALUES (3, 1, 1, 3, 45.0);
INSERT INTO "progress" ("userId", "moduleId", "chapterId", "sectionId", "value") VALUES (3, 1, 2, 7, 20.5);
INSERT INTO "progress" ("userId", "moduleId", "chapterId", "sectionId", "value") VALUES (3, 1, 2, 8, 65.5);
INSERT INTO "progress" ("userId", "moduleId", "chapterId", "sectionId", "value") VALUES (3, 1, 2, 9, 35.5);

-- Table: comment
-- Table: comment
INSERT INTO "comment" ("parentId", "userId", "commentUserId", "sectionId", "createdAt", "text") VALUES (NULL, 3, 1, 1, '2025-01-01 09:15:00', 'Breathing exercises can be very effective!');
INSERT INTO "comment" ("parentId", "userId", "commentUserId", "sectionId", "createdAt", "text") VALUES (   1, 3, 2, 1, '2025-01-02 10:00:00', 'I agree, deep breathing helps me calm down quickly.');
INSERT INTO "comment" ("parentId", "userId", "commentUserId", "sectionId", "createdAt", "text") VALUES (   1, 3, 3, 1, '2025-01-03 11:45:00', 'Adding mindfulness to breathing works wonders.');
INSERT INTO "comment" ("parentId", "userId", "commentUserId", "sectionId", "createdAt", "text") VALUES (   1, 3, 2, 1, '2025-01-04 14:30:00', 'Yes which helps me to improve');
INSERT INTO "comment" ("parentId", "userId", "commentUserId", "sectionId", "createdAt", "text") VALUES (   1, 3, 1, 1, '2025-01-05 16:20:00', 'Thanks');
INSERT INTO "comment" ("parentId", "userId", "commentUserId", "sectionId", "createdAt", "text") VALUES (NULL, 3, 2, 1, '2025-01-06 09:15:00', 'Exercising regularly is my favorite way to reduce stress.');
INSERT INTO "comment" ("parentId", "userId", "commentUserId", "sectionId", "createdAt", "text") VALUES (   6, 3, 1, 1, '2025-01-07 10:45:00', 'Same here! Even a short walk helps clear my mind.');
INSERT INTO "comment" ("parentId", "userId", "commentUserId", "sectionId", "createdAt", "text") VALUES (   6, 3, 3, 1, '2025-01-08 13:00:00', 'Physical activity is a great outlet for anxiety.');

INSERT INTO "comment" ("parentId", "userId", "commentUserId", "sectionId", "createdAt", "text") VALUES (NULL, 3, 3, 2, '2025-01-09 09:00:00', 'Breaking down fears into smaller steps works well.');
INSERT INTO "comment" ("parentId", "userId", "commentUserId", "sectionId", "createdAt", "text") VALUES (   9, 3, 1, 2, '2025-01-10 10:30:00', 'I love this idea! Gradual exposure really builds confidence.');
INSERT INTO "comment" ("parentId", "userId", "commentUserId", "sectionId", "createdAt", "text") VALUES (   9, 3, 2, 2, '2025-01-11 11:15:00', 'Yes, baby steps make things less overwhelming.');
INSERT INTO "comment" ("parentId", "userId", "commentUserId", "sectionId", "createdAt", "text") VALUES (NULL, 3, 2, 2, '2025-01-11 14:45:00', 'Visualizing success helps me face tough situations.');
INSERT INTO "comment" ("parentId", "userId", "commentUserId", "sectionId", "createdAt", "text") VALUES (  12, 3, 3, 2, '2025-01-12 15:30:00', 'That’s true. Positive imagery makes a big difference.');
INSERT INTO "comment" ("parentId", "userId", "commentUserId", "sectionId", "createdAt", "text") VALUES (  12, 3, 1, 2, '2025-01-12 17:45:00', 'I find it inspiring and empowering as well!');

INSERT INTO "comment" ("parentId", "userId", "commentUserId", "sectionId", "createdAt", "text") VALUES (NULL, 3, 1, 3, '2025-01-05 12:30:00', 'Therapy can be life-changing for anxiety management.');
INSERT INTO "comment" ("parentId", "userId", "commentUserId", "sectionId", "createdAt", "text") VALUES (  15, 3, 2, 3, '2025-01-06 14:45:00', 'Agreed. Talking to a professional really helps.');
INSERT INTO "comment" ("parentId", "userId", "commentUserId", "sectionId", "createdAt", "text") VALUES (  15, 3, 3, 3, '2025-01-07 09:00:00', 'Yes, cognitive behavioral therapy is particularly effective.');
INSERT INTO "comment" ("parentId", "userId", "commentUserId", "sectionId", "createdAt", "text") VALUES (  15, 3, 1, 3, '2025-01-08 11:15:00', 'Thanks');
INSERT INTO "comment" ("parentId", "userId", "commentUserId", "sectionId", "createdAt", "text") VALUES (NULL, 3, 2, 3, '2025-01-09 13:45:00', 'Maintaining a gratitude journal has been helpful for me.');
INSERT INTO "comment" ("parentId", "userId", "commentUserId", "sectionId", "createdAt", "text") VALUES (  19, 3, 1, 3, '2025-01-10 14:30:00', 'Writing down positive things daily is a great habit.');
INSERT INTO "comment" ("parentId", "userId", "commentUserId", "sectionId", "createdAt", "text") VALUES (  19, 3, 3, 3, '2025-01-11 15:45:00', 'It’s amazing how much it shifts your mindset over time.');

-- Table: mood
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-10-24 01:18:29', 2, 9);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-10-15 01:21:21', 3, 2);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-10-01 05:22:12', 3, 5);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-10-27 18:11:29', 1, 0);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-11-01 15:42:31', 1, 10);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-12-01 06:34:52', 4, 4);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-10-30 14:45:22', 3, 6);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-11-15 17:38:12', 1, 3);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-12-12 23:56:18', 2, 7);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-10-20 08:25:40', 4, 8);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-12-02 12:01:55', 1, 9);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-11-23 20:10:10', 2, 5);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-10-11 09:42:35', 3, 10);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-11-28 05:15:24', 4, 0);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-12-20 19:31:43', 1, 6);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-10-18 02:44:50', 2, 2);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-11-09 11:53:30', 3, 8);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-12-14 16:22:18', 4, 1);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-10-07 22:30:14', 1, 7);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-12-30 03:14:27', 2, 3);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-11-04 14:50:31', 3, 4);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-11-21 12:33:18', 4, 10);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-11-19 07:11:44', 1, 0);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-10-02 13:18:59', 2, 1);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-10-05 15:27:12', 3, 5);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-11-27 19:46:22', 4, 9);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-12-25 10:04:10', 1, 2);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-11-06 06:37:51', 2, 4);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-10-13 20:29:36', 3, 6);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-11-18 11:50:12', 4, 8);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-12-10 14:15:33', 1, 10);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-12-04 09:42:22', 2, 3);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-11-30 04:31:11', 3, 7);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-10-23 12:25:49', 4, 5);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-12-18 17:13:01', 1, 8);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-11-25 07:56:14', 2, 6);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-10-14 22:33:18', 3, 0);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-11-08 05:45:22', 4, 1);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-12-08 18:14:37', 1, 9);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-10-03 03:11:21', 2, 10);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-11-13 02:01:15', 3, 2);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-12-29 21:31:55', 4, 7);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-10-25 06:18:39', 1, 4);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-11-16 15:44:23', 2, 8);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-12-03 22:27:12', 3, 3);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-12-22 19:12:11', 4, 6);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-10-28 11:41:10', 1, 0);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-11-11 08:54:31', 2, 5);