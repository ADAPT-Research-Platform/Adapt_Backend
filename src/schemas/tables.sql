CREATE TYPE user_role AS ENUM ('admin', 'client');

CREATE TABLE "user" (
    "id" SERIAL PRIMARY KEY,
    "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
    "deletedAt" TIMESTAMP,
    "isActive" boolean NOT NULL DEFAULT true,
    "username" character varying(20) UNIQUE NOT NULL,
    "email" character varying(255) UNIQUE NOT NULL,
    "role" user_role NOT NULL DEFAULT 'client',
    "hashPassword" character varying NOT NULL,
    "salt" character varying NOT NULL,
    "isVerified" boolean NOT NULL DEFAULT false
);

CREATE TABLE "module" (
    "id" SERIAL PRIMARY KEY,
    "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
    "deletedAt" TIMESTAMP,
    "isActive" boolean NOT NULL DEFAULT true
);

CREATE TABLE "chapter" (
    "id" SERIAL PRIMARY KEY,
    "moduleId" INT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
    "deletedAt" TIMESTAMP,
    "isActive" boolean NOT NULL DEFAULT true,
    "title" character varying(255) NOT NULL,
    FOREIGN KEY ("moduleId") REFERENCES "module"("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE "section" (
    "id" SERIAL PRIMARY KEY,
    "chapterId" INT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
    "deletedAt" TIMESTAMP,
    "isActive" boolean NOT NULL DEFAULT true,
    "folderUrl" text NOT NULL, -- Added folder url
    "title" character varying(255) NOT NULL,
    "isExercise" boolean NOT NULL DEFAULT true,
    FOREIGN KEY ("chapterId") REFERENCES "chapter"("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE "progress" (
    "userId" INT NOT NULL,
    "moduleId" INT NOT NULL,
    "chapterId" INT NOT NULL,
    "sectionId" INT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
    "value" FLOAT DEFAULT 0.0,
    PRIMARY KEY ("userId", "moduleId", "chapterId", "sectionId"),
    FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
    FOREIGN KEY ("moduleId") REFERENCES "module"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
    FOREIGN KEY ("chapterId") REFERENCES "chapter"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
    FOREIGN KEY ("sectionId") REFERENCES "section"("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE "comment" (
    "id" SERIAL PRIMARY KEY,
    "parentId" INT,
    "sectionUserId" INT NOT NULL,
    "commentUserId" INT NOT NULL,
    "sectionId" INT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
    "text" text NOT NULL,
    FOREIGN KEY ("parentId") REFERENCES "comment"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
    FOREIGN KEY ("sectionUserId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
    FOREIGN KEY ("commentUserId") REFERENCES "user"("id"),
    FOREIGN KEY ("sectionId") REFERENCES "section"("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE "answer" (
    "userId" INT NOT NULL,
    "sectionId" INT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
    "deletedAt" TIMESTAMP,
    "isActive" boolean NOT NULL DEFAULT true,
    "text" json NOT NULL,
    PRIMARY KEY ("userId", "sectionId"),
    FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
    FOREIGN KEY ("sectionId") REFERENCES "section"("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE "mood" (
    "userId" INT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
    "createdDate" DATE GENERATED ALWAYS AS ("createdAt"::DATE) STORED,
    "feeling" integer NOT NULL,
    "motivation" integer NOT NULL,
    PRIMARY KEY ("userId", "createdDate"),
    FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
);