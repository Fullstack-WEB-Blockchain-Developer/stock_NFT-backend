import { MigrationInterface, QueryRunner } from 'typeorm';

export class dropNftFileSizes1649073462208 implements MigrationInterface {
  name = 'dropNftFileSizes1649073462208';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "nfts" DROP COLUMN "fileNameSmall"`);
    await queryRunner.query(`ALTER TABLE "nfts" DROP COLUMN "fileNameMedium"`);
    await queryRunner.query(`ALTER TABLE "nfts" DROP COLUMN "fileNameLarge"`);
    await queryRunner.query(`ALTER TABLE "nfts" ADD "fileName" text NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "nfts" DROP COLUMN "fileName"`);
    await queryRunner.query(
      `ALTER TABLE "nfts" ADD "fileNameLarge" text NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "nfts" ADD "fileNameMedium" text NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "nfts" ADD "fileNameSmall" text NOT NULL`,
    );
  }
}
