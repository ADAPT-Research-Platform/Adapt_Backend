import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterModuleProgressChapterProgressAndAddFileProgress1735981775124 implements MigrationInterface {
    name = 'AlterModuleProgressChapterProgressAndAddFileProgress1735981775124'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "file_progress" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isCompleted" boolean NOT NULL DEFAULT false, "completedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "chapterProgressId" uuid NOT NULL, "fileId" uuid NOT NULL, CONSTRAINT "UQ_c6904e12cb4d1383910a9984ce2" UNIQUE ("chapterProgressId", "fileId"), CONSTRAINT "PK_bbd89b05b08fce62ddf81c3207d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "chapter_progress" ADD CONSTRAINT "CHK_bb090d35902a9e2e66b2835461" CHECK ("progressPercentage" >= 0 AND "progressPercentage" <= 100)`);
        await queryRunner.query(`ALTER TABLE "file_progress" ADD CONSTRAINT "FK_cc651f8a90889673cb165b6e46b" FOREIGN KEY ("chapterProgressId") REFERENCES "chapter_progress"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "file_progress" ADD CONSTRAINT "FK_3e5b8ebf7c3b4c5bc1672b6049e" FOREIGN KEY ("fileId") REFERENCES "file"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file_progress" DROP CONSTRAINT "FK_3e5b8ebf7c3b4c5bc1672b6049e"`);
        await queryRunner.query(`ALTER TABLE "file_progress" DROP CONSTRAINT "FK_cc651f8a90889673cb165b6e46b"`);
        await queryRunner.query(`ALTER TABLE "chapter_progress" DROP CONSTRAINT "CHK_bb090d35902a9e2e66b2835461"`);
        await queryRunner.query(`DROP TABLE "file_progress"`);
    }

}
