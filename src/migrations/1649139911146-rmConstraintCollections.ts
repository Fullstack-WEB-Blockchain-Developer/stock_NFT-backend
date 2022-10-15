import { MigrationInterface, QueryRunner } from 'typeorm';

export class rmConstraintCollections1649139911146
  implements MigrationInterface
{
  name = 'rmConstraintCollections1649139911146';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "collections" ALTER COLUMN "logoImage" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "collections" ALTER COLUMN "logoImage" SET NOT NULL`,
    );
  }
}
