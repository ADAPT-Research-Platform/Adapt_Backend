import { MigrationInterface, QueryRunner } from "typeorm";

export class AddChapterProgressAndUserProgress1734117744581 implements MigrationInterface {
    name = 'AddChapterProgressAndUserProgress1734117744581'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."chapter_progress_completionstatus_enum" AS ENUM('Not Started', 'In Progress', 'Completed')`);
        await queryRunner.query(`CREATE TABLE "chapter_progress" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "progressPercentage" double precision NOT NULL DEFAULT '0', "completionStatus" "public"."chapter_progress_completionstatus_enum" NOT NULL DEFAULT 'Not Started', "completedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "moduleProgressId" uuid NOT NULL, "chapterId" uuid NOT NULL, CONSTRAINT "UQ_f665d97cb0be2a0c5009eb9503b" UNIQUE ("moduleProgressId", "chapterId"), CONSTRAINT "PK_7276d733f4fd2d78a9b2955fd9b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."module_progress_completionstatus_enum" AS ENUM('Not Started', 'In Progress', 'Completed')`);
        await queryRunner.query(`CREATE TABLE "module_progress" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "progressPercentage" double precision NOT NULL DEFAULT '0', "completionStatus" "public"."module_progress_completionstatus_enum" NOT NULL DEFAULT 'Not Started', "completedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid NOT NULL, "moduleId" uuid NOT NULL, CONSTRAINT "UQ_0284f915d67efa2f84d094bb71d" UNIQUE ("userId", "moduleId"), CONSTRAINT "PK_29f00069652b2ea973d36e6db99" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "chapter_progress" ADD CONSTRAINT "FK_8e2666814c2d9b93e0cae003d77" FOREIGN KEY ("moduleProgressId") REFERENCES "module_progress"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chapter_progress" ADD CONSTRAINT "FK_3d27a9062f5619dc5ff27c0dcc3" FOREIGN KEY ("chapterId") REFERENCES "chapter"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "module_progress" ADD CONSTRAINT "FK_98f1c5ca34a9ec9061a8becbfc6" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "module_progress" ADD CONSTRAINT "FK_ec5b24ea3c1adaa2e3cebb82fbd" FOREIGN KEY ("moduleId") REFERENCES "module"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "module_progress" DROP CONSTRAINT "FK_ec5b24ea3c1adaa2e3cebb82fbd"`);
        await queryRunner.query(`ALTER TABLE "module_progress" DROP CONSTRAINT "FK_98f1c5ca34a9ec9061a8becbfc6"`);
        await queryRunner.query(`ALTER TABLE "chapter_progress" DROP CONSTRAINT "FK_3d27a9062f5619dc5ff27c0dcc3"`);
        await queryRunner.query(`ALTER TABLE "chapter_progress" DROP CONSTRAINT "FK_8e2666814c2d9b93e0cae003d77"`);
        await queryRunner.query(`DROP TABLE "module_progress"`);
        await queryRunner.query(`DROP TYPE "public"."module_progress_completionstatus_enum"`);
        await queryRunner.query(`DROP TABLE "chapter_progress"`);
        await queryRunner.query(`DROP TYPE "public"."chapter_progress_completionstatus_enum"`);
    }

}
