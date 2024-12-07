import { MigrationInterface, QueryRunner } from "typeorm";

export class AddModulesChaptersAndExerciseEntities1733513601684
  implements MigrationInterface
{
  name = "AddModulesChaptersAndExerciseEntities1733513601684";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "module" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "name" character varying(255) NOT NULL,
                "description" text,
                "isActive" boolean NOT NULL DEFAULT true,
                CONSTRAINT "UQ_620a549dbcb1fff62ea85695ca3" UNIQUE ("name"),
                CONSTRAINT "PK_0e20d657f968b051e674fbe3117" PRIMARY KEY ("id")
            )
        `);

    await queryRunner.query(`
            CREATE TABLE "chapter" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "name" character varying(255) NOT NULL,
                "description" text,
                "order" integer NOT NULL,
                "isActive" boolean NOT NULL DEFAULT true,
                "fileUrl" text,  -- Added fileUrl field
                "moduleId" uuid,
                CONSTRAINT "PK_275bd1c62bed7dff839680614ca" PRIMARY KEY ("id")
            )
        `);

    await queryRunner.query(`
            CREATE TYPE "public"."exercise_difficulty_enum" AS ENUM('Easy', 'Medium', 'Hard')
        `);

    await queryRunner.query(`
            CREATE TABLE "exercise" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "title" character varying(255) NOT NULL,
                "content" text,
                "order" integer NOT NULL,
                "difficulty" "public"."exercise_difficulty_enum" NOT NULL DEFAULT 'Medium',
                "isActive" boolean NOT NULL DEFAULT true,
                "fileUrl" text,  -- Added fileUrl field
                "chapterId" uuid,
                CONSTRAINT "PK_a0f107e3a2ef2742c1e91d97c14" PRIMARY KEY ("id")
            )
        `);

    await queryRunner.query(`
            ALTER TABLE "chapter"
            ADD CONSTRAINT "FK_9aef34080254dd2708033cdde19"
            FOREIGN KEY ("moduleId")
            REFERENCES "module"("id")
            ON DELETE CASCADE
            ON UPDATE NO ACTION
        `);

    await queryRunner.query(`
            ALTER TABLE "exercise"
            ADD CONSTRAINT "FK_f3c89d34fc545817184c0891401"
            FOREIGN KEY ("chapterId")
            REFERENCES "chapter"("id")
            ON DELETE CASCADE
            ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "exercise" DROP CONSTRAINT "FK_f3c89d34fc545817184c0891401"`
    );
    await queryRunner.query(
      `ALTER TABLE "chapter" DROP CONSTRAINT "FK_9aef34080254dd2708033cdde19"`
    );
    await queryRunner.query(`DROP TABLE "exercise"`);
    await queryRunner.query(`DROP TYPE "public"."exercise_difficulty_enum"`);
    await queryRunner.query(`DROP TABLE "chapter"`);
    await queryRunner.query(`DROP TABLE "module"`);
  }
}
