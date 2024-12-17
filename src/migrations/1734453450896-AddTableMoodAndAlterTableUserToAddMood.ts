import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTableMoodAndAlterTableUserToAddMood1734453450896 implements MigrationInterface {
    name = 'AddTableMoodAndAlterTableUserToAddMood1734453450896'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "mood" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "feeling" integer NOT NULL, "motivation" integer NOT NULL, "date" date NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid NOT NULL, CONSTRAINT "UQ_3b66a361a02f46245afc0b583ce" UNIQUE ("userId", "date"), CONSTRAINT "PK_cd069bf46deedf0ef3a7771f44b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "mood" ADD CONSTRAINT "FK_063b678cbb2c84dfd95dff5da22" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mood" DROP CONSTRAINT "FK_063b678cbb2c84dfd95dff5da22"`);
        await queryRunner.query(`DROP TABLE "mood"`);
    }

}
