import { MigrationInterface, QueryRunner } from 'typeorm';

export class Gen1725018472550 implements MigrationInterface {
  name = 'Gen1725018472550';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "survey" ADD "starRating" integer NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "survey" DROP COLUMN "starRating"`);
  }
}
