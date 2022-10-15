import { MigrationInterface, QueryRunner } from 'typeorm';

export class changeArrayTypes1649335028142 implements MigrationInterface {
  name = 'changeArrayTypes1649335028142';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "nfts" DROP COLUMN "properties"`);
    await queryRunner.query(`ALTER TABLE "nfts" ADD "properties" jsonb`);
    await queryRunner.query(`ALTER TABLE "nfts" DROP COLUMN "levels"`);
    await queryRunner.query(`ALTER TABLE "nfts" ADD "levels" jsonb`);
    await queryRunner.query(`ALTER TABLE "nfts" DROP COLUMN "stats"`);
    await queryRunner.query(`ALTER TABLE "nfts" ADD "stats" jsonb`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "nfts" DROP COLUMN "stats"`);
    await queryRunner.query(`ALTER TABLE "nfts" ADD "stats" jsonb array`);
    await queryRunner.query(`ALTER TABLE "nfts" DROP COLUMN "levels"`);
    await queryRunner.query(`ALTER TABLE "nfts" ADD "levels" jsonb array`);
    await queryRunner.query(`ALTER TABLE "nfts" DROP COLUMN "properties"`);
    await queryRunner.query(`ALTER TABLE "nfts" ADD "properties" jsonb array`);
  }
}
