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
INSERT INTO "section" ("chapterId", "folderUrl", "title", "isExercise", "isActive") VALUES (1, 'module_01/chapter_01/section_01', 'Hallo und herzlich willkommen!', false, true);
INSERT INTO "section" ("chapterId", "folderUrl", "title", "isExercise", "isActive") VALUES (1, 'module_01/chapter_01/section_02', 'Zahlen und Fakten – Angst weltweit', false, true);
INSERT INTO "section" ("chapterId", "folderUrl", "title", "isExercise", "isActive") VALUES (1, 'module_01/chapter_01/section_03', 'Max und Hanna', false, true);
INSERT INTO "section" ("chapterId", "folderUrl", "title", "isExercise", "isActive") VALUES (1, 'module_01/chapter_01/section_04', 'Grundlagen der App', false, true);
INSERT INTO "section" ("chapterId", "folderUrl", "title", "isExercise", "isActive") VALUES (1, 'module_01/chapter_01/section_05', 'Ein kurzer Einstieg', false, true);
INSERT INTO "section" ("chapterId", "folderUrl", "title", "isExercise", "isActive") VALUES (1, 'module_01/chapter_01/section_06', 'Meine Ängste', true, true);
INSERT INTO "section" ("chapterId", "folderUrl", "title", "isExercise", "isActive") VALUES (2, 'module_01/chapter_02/section_01', 'Warum Angst wichtig ist', false, true);
INSERT INTO "section" ("chapterId", "folderUrl", "title", "isExercise", "isActive") VALUES (2, 'module_01/chapter_02/section_02', 'Wann Angst zu viel wird', false, true);
INSERT INTO "section" ("chapterId", "folderUrl", "title", "isExercise", "isActive") VALUES (2, 'module_01/chapter_02/section_03', 'Ist meine Angst noch normal?', false, true);
INSERT INTO "section" ("chapterId", "folderUrl", "title", "isExercise", "isActive") VALUES (2, 'module_01/chapter_02/section_04', 'Und jetzt?', false, true);
INSERT INTO "section" ("chapterId", "folderUrl", "title", "isExercise", "isActive") VALUES (2, 'module_01/chapter_02/section_05', 'Komponenten der Angst', true, true);
INSERT INTO "section" ("chapterId", "folderUrl", "title", "isExercise", "isActive") VALUES (2, 'module_01/chapter_02/section_06', 'Was vermittle ich meinem Kind?', true, true);
INSERT INTO "section" ("chapterId", "folderUrl", "title", "isExercise", "isActive") VALUES (2, 'module_01/chapter_02/section_07', 'Was kann ich tun?', false, true);
INSERT INTO "section" ("chapterId", "folderUrl", "title", "isExercise", "isActive") VALUES (2, 'module_01/chapter_02/section_08', 'Mein Fazit', true, true);

-- Table: comment
INSERT INTO "comment" ("parentId", "sectionUserId", "commentUserId", "sectionId", "createdAt", "text") VALUES (NULL, 3, 1, 1, '2025-01-01 09:15:00', 'Breathing exercises can be very effective!');
INSERT INTO "comment" ("parentId", "sectionUserId", "commentUserId", "sectionId", "createdAt", "text") VALUES (   1, 3, 2, 1, '2025-01-02 10:00:00', 'I agree, deep breathing helps me calm down quickly.');
INSERT INTO "comment" ("parentId", "sectionUserId", "commentUserId", "sectionId", "createdAt", "text") VALUES (   1, 3, 3, 1, '2025-01-03 11:45:00', 'Adding mindfulness to breathing works wonders.');
INSERT INTO "comment" ("parentId", "sectionUserId", "commentUserId", "sectionId", "createdAt", "text") VALUES (   1, 3, 2, 1, '2025-01-04 14:30:00', 'Yes which helps me to improve');
INSERT INTO "comment" ("parentId", "sectionUserId", "commentUserId", "sectionId", "createdAt", "text") VALUES (   1, 3, 1, 1, '2025-01-05 16:20:00', 'Thanks');
INSERT INTO "comment" ("parentId", "sectionUserId", "commentUserId", "sectionId", "createdAt", "text") VALUES (NULL, 3, 2, 1, '2025-01-06 09:15:00', 'Exercising regularly is my favorite way to reduce stress.');
INSERT INTO "comment" ("parentId", "sectionUserId", "commentUserId", "sectionId", "createdAt", "text") VALUES (   6, 3, 1, 1, '2025-01-07 10:45:00', 'Same here! Even a short walk helps clear my mind.');
INSERT INTO "comment" ("parentId", "sectionUserId", "commentUserId", "sectionId", "createdAt", "text") VALUES (   6, 3, 3, 1, '2025-01-08 13:00:00', 'Physical activity is a great outlet for anxiety.');

INSERT INTO "comment" ("parentId", "sectionUserId", "commentUserId", "sectionId", "createdAt", "text") VALUES (NULL, 3, 3, 2, '2025-01-09 09:00:00', 'Breaking down fears into smaller steps works well.');
INSERT INTO "comment" ("parentId", "sectionUserId", "commentUserId", "sectionId", "createdAt", "text") VALUES (   9, 3, 1, 2, '2025-01-10 10:30:00', 'I love this idea! Gradual exposure really builds confidence.');
INSERT INTO "comment" ("parentId", "sectionUserId", "commentUserId", "sectionId", "createdAt", "text") VALUES (   9, 3, 2, 2, '2025-01-11 11:15:00', 'Yes, baby steps make things less overwhelming.');
INSERT INTO "comment" ("parentId", "sectionUserId", "commentUserId", "sectionId", "createdAt", "text") VALUES (NULL, 3, 2, 2, '2025-01-11 14:45:00', 'Visualizing success helps me face tough situations.');
INSERT INTO "comment" ("parentId", "sectionUserId", "commentUserId", "sectionId", "createdAt", "text") VALUES (  12, 3, 3, 2, '2025-01-12 15:30:00', 'That’s true. Positive imagery makes a big difference.');
INSERT INTO "comment" ("parentId", "sectionUserId", "commentUserId", "sectionId", "createdAt", "text") VALUES (  12, 3, 1, 2, '2025-01-12 17:45:00', 'I find it inspiring and empowering as well!');

INSERT INTO "comment" ("parentId", "sectionUserId", "commentUserId", "sectionId", "createdAt", "text") VALUES (NULL, 3, 1, 3, '2025-01-05 12:30:00', 'Therapy can be life-changing for anxiety management.');
INSERT INTO "comment" ("parentId", "sectionUserId", "commentUserId", "sectionId", "createdAt", "text") VALUES (  15, 3, 2, 3, '2025-01-06 14:45:00', 'Agreed. Talking to a professional really helps.');
INSERT INTO "comment" ("parentId", "sectionUserId", "commentUserId", "sectionId", "createdAt", "text") VALUES (  15, 3, 3, 3, '2025-01-07 09:00:00', 'Yes, cognitive behavioral therapy is particularly effective.');
INSERT INTO "comment" ("parentId", "sectionUserId", "commentUserId", "sectionId", "createdAt", "text") VALUES (  15, 3, 1, 3, '2025-01-08 11:15:00', 'Thanks');
INSERT INTO "comment" ("parentId", "sectionUserId", "commentUserId", "sectionId", "createdAt", "text") VALUES (NULL, 3, 2, 3, '2025-01-09 13:45:00', 'Maintaining a gratitude journal has been helpful for me.');
INSERT INTO "comment" ("parentId", "sectionUserId", "commentUserId", "sectionId", "createdAt", "text") VALUES (  19, 3, 1, 3, '2025-01-10 14:30:00', 'Writing down positive things daily is a great habit.');
INSERT INTO "comment" ("parentId", "sectionUserId", "commentUserId", "sectionId", "createdAt", "text") VALUES (  19, 3, 3, 3, '2025-01-11 15:45:00', 'It’s amazing how much it shifts your mindset over time.');

-- Table: mood
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2023-12-05 01:41:02', 1, 4);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2023-12-09 03:42:55', 3, 3);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2023-12-13 05:46:31', 2, 3);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2023-12-17 08:01:06', 2, 5);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2023-12-21 10:13:23', 2, 5);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2023-12-25 12:21:07', 4, 3);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2023-12-29 13:51:05', 2, 4);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-01-02 16:50:51', 2, 5);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-01-06 19:37:38', 4, 3);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-01-10 21:08:29', 2, 0);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-01-14 23:10:17', 2, 10);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-01-19 00:26:28', 3, 2);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-01-23 02:51:24', 3, 2);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-01-27 04:04:39', 2, 6);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-01-31 06:03:03', 4, 6);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-02-04 07:33:13', 3, 6);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-02-08 10:10:17', 3, 4);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-02-12 12:05:07', 2, 10);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-02-16 15:08:34', 2, 2);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-02-20 17:06:02', 2, 7);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-02-24 19:58:27', 2, 8);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-02-28 21:10:39', 2, 7);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-03-03 22:57:44', 3, 9);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-03-08 01:18:36', 3, 6);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-03-12 03:42:30', 1, 8);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-03-16 06:46:59', 3, 4);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-03-20 08:03:26', 1, 10);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-03-24 10:36:57', 4, 0);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-03-28 12:39:49', 2, 3);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-04-01 13:53:59', 3, 4);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-04-05 15:28:53', 2, 9);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-04-09 16:57:51', 1, 0);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-04-13 19:48:45', 4, 7);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-04-17 22:18:51', 1, 3);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-04-22 01:14:41', 2, 1);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-04-26 03:53:10', 3, 1);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-04-30 05:39:00', 1, 3);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-05-04 07:09:04', 4, 7);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-05-08 08:48:14', 3, 0);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-05-12 10:14:23', 3, 1);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-05-16 12:16:56', 4, 3);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-05-20 13:37:13', 2, 8);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-05-24 16:43:13', 3, 9);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-05-28 19:47:45', 4, 4);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-06-01 22:26:18', 4, 3);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-06-06 00:33:12', 2, 10);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-06-10 03:19:04', 1, 2);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-06-14 04:37:27', 1, 6);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-06-18 06:01:17', 4, 3);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-06-22 08:12:21', 4, 4);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-06-26 09:48:29', 4, 6);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-06-30 12:23:38', 4, 0);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-07-04 13:36:20', 2, 8);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-07-08 16:22:01', 1, 4);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-07-12 19:31:00', 4, 8);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-07-16 22:00:55', 1, 7);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-07-21 00:59:52', 4, 9);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-07-25 02:52:44', 2, 8);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-07-29 04:34:29', 3, 5);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-08-02 06:10:48', 2, 3);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-08-06 09:00:58', 1, 1);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-08-10 11:31:18', 3, 5);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-08-14 13:37:51', 1, 10);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-08-18 14:48:38', 1, 3);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-08-22 16:04:12', 4, 9);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-08-26 17:14:24', 3, 0);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-08-30 19:27:22', 3, 10);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-09-03 21:09:47', 3, 4);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-09-07 23:00:52', 3, 5);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-09-12 01:41:47', 4, 6);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-09-16 04:29:19', 2, 10);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-09-20 06:11:01', 2, 2);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-09-24 08:48:07', 4, 10);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-09-28 11:12:56', 1, 1);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-10-02 13:51:04', 4, 2);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-10-06 16:38:11', 2, 7);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-10-10 18:00:09', 3, 9);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-10-14 20:05:50', 1, 10);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-10-18 22:36:29', 4, 7);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-10-23 01:05:13', 3, 10);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-10-27 03:38:47', 1, 1);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-10-31 05:34:43', 1, 5);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-11-04 07:09:03', 4, 5);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-11-08 09:37:01', 4, 1);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-11-12 12:14:24', 4, 9);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-11-16 13:59:23', 2, 5);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-11-20 16:59:28', 3, 0);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-11-24 20:08:45', 2, 8);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-11-28 22:28:13', 3, 5);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-12-02 23:40:24', 1, 6);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-12-07 01:07:25', 2, 9);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-12-11 02:52:20', 2, 7);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-12-15 05:11:36', 2, 5);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-12-19 06:45:36', 4, 8);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-12-23 08:10:00', 1, 6);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-12-27 11:16:50', 2, 6);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2024-12-31 13:11:58', 4, 8);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2025-01-04 14:21:45', 2, 3);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2025-01-08 16:43:08', 1, 7);
INSERT INTO "mood" ("userId", "createdAt", "feeling", "motivation") VALUES (3, '2025-01-12 19:46:38', 1, 10);

-- Insert into the table "progress" the progress of the user
INSERT INTO "progress" ("userId", "sectionId", "value") VALUES (3, 1, 0.5);
INSERT INTO "progress" ("userId", "sectionId", "value") VALUES (3, 2, 0.5);
INSERT INTO "progress" ("userId", "sectionId", "value") VALUES (3, 3, 0.5); 