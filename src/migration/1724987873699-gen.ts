import { MigrationInterface, QueryRunner } from 'typeorm';

export class Gen1724987873699 implements MigrationInterface {
  name = 'Gen1724987873699';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "question" ("questionId" character varying NOT NULL, "question" character varying NOT NULL, "surveyId" character varying, CONSTRAINT "PK_f5c864430d1f3626bc6671d6b8d" PRIMARY KEY ("questionId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f5c864430d1f3626bc6671d6b8" ON "question" ("questionId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "response" ("responseId" character varying NOT NULL, "answer" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "surveyId" character varying, "questionId" character varying, CONSTRAINT "PK_569e25b0ce8135a01b1ff9fb146" PRIMARY KEY ("responseId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_569e25b0ce8135a01b1ff9fb14" ON "response" ("responseId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "survey" ("surveyId" character varying NOT NULL, "title" character varying NOT NULL, "targetAudience" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2bb1a75a612fa166da6f77122ba" PRIMARY KEY ("surveyId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2bb1a75a612fa166da6f77122b" ON "survey" ("surveyId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_af2eef92c9425e355b20bd941f" ON "survey" ("title") `,
    );
    await queryRunner.query(
      `ALTER TABLE "question" ADD CONSTRAINT "FK_a1188e0f702ab268e0982049e5c" FOREIGN KEY ("surveyId") REFERENCES "survey"("surveyId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "response" ADD CONSTRAINT "FK_57ae9b4b711490ee8c929cb04ad" FOREIGN KEY ("surveyId") REFERENCES "survey"("surveyId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "response" ADD CONSTRAINT "FK_dfd952a4d26cf661248efec5f37" FOREIGN KEY ("questionId") REFERENCES "question"("questionId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "response" DROP CONSTRAINT "FK_dfd952a4d26cf661248efec5f37"`,
    );
    await queryRunner.query(
      `ALTER TABLE "response" DROP CONSTRAINT "FK_57ae9b4b711490ee8c929cb04ad"`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" DROP CONSTRAINT "FK_a1188e0f702ab268e0982049e5c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_af2eef92c9425e355b20bd941f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2bb1a75a612fa166da6f77122b"`,
    );
    await queryRunner.query(`DROP TABLE "survey"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_569e25b0ce8135a01b1ff9fb14"`,
    );
    await queryRunner.query(`DROP TABLE "response"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f5c864430d1f3626bc6671d6b8"`,
    );
    await queryRunner.query(`DROP TABLE "question"`);
  }
}
