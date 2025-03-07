import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTableFilesAndAlterTableChapterAndExerciseForFiles1734386795855 implements MigrationInterface {
    name = 'AddTableFilesAndAlterTableChapterAndExerciseForFiles1734386795855'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "file" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "filePath" character varying NOT NULL, "uploadedAt" TIMESTAMP NOT NULL DEFAULT now(), "chapterId" uuid, "exerciseId" uuid, CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "file" ADD CONSTRAINT "FK_b390a7acf5c625c68716d5fbe5e" FOREIGN KEY ("chapterId") REFERENCES "chapter"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "file" ADD CONSTRAINT "FK_a19d0c96b738454daf3c81ab1d9" FOREIGN KEY ("exerciseId") REFERENCES "exercise"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file" DROP CONSTRAINT "FK_a19d0c96b738454daf3c81ab1d9"`);
        await queryRunner.query(`ALTER TABLE "file" DROP CONSTRAINT "FK_b390a7acf5c625c68716d5fbe5e"`);
        await queryRunner.query(`DROP TABLE "file"`);
    }

}
