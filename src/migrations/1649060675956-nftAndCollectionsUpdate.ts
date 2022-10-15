import { MigrationInterface, QueryRunner } from 'typeorm';

export class nftAndCollectionsUpdate1649060675956
  implements MigrationInterface
{
  name = 'nftAndCollectionsUpdate1649060675956';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "nfts" RENAME COLUMN "blockchainType" TO "blockchainTypeId"`,
    );
    await queryRunner.query(
      `CREATE TABLE "blockchain_types" ("id" SERIAL NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" text NOT NULL, CONSTRAINT "UQ_f63b1373040651f97285f9ca7d6" UNIQUE ("name"), CONSTRAINT "PK_8afce653cef78fb02cc40345f75" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "collections" ADD "logoImage" text NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "collections" ADD "featuredImage" text`,
    );
    await queryRunner.query(`ALTER TABLE "collections" ADD "bannerImage" text`);
    await queryRunner.query(`ALTER TABLE "collections" ADD "url" text`);
    await queryRunner.query(`ALTER TABLE "collections" ADD "description" text`);
    await queryRunner.query(`ALTER TABLE "collections" ADD "category" text`);
    await queryRunner.query(
      `ALTER TABLE "nfts" DROP COLUMN "blockchainTypeId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "nfts" ADD "blockchainTypeId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "nfts" ADD CONSTRAINT "FK_bb50714a04d932e9c191ce5bb7c" FOREIGN KEY ("blockchainTypeId") REFERENCES "collections"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "nfts" DROP CONSTRAINT "FK_bb50714a04d932e9c191ce5bb7c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "nfts" DROP COLUMN "blockchainTypeId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "nfts" ADD "blockchainTypeId" text NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "collections" DROP COLUMN "category"`);
    await queryRunner.query(
      `ALTER TABLE "collections" DROP COLUMN "description"`,
    );
    await queryRunner.query(`ALTER TABLE "collections" DROP COLUMN "url"`);
    await queryRunner.query(
      `ALTER TABLE "collections" DROP COLUMN "bannerImage"`,
    );
    await queryRunner.query(
      `ALTER TABLE "collections" DROP COLUMN "featuredImage"`,
    );
    await queryRunner.query(
      `ALTER TABLE "collections" DROP COLUMN "logoImage"`,
    );
    await queryRunner.query(`DROP TABLE "blockchain_types"`);
    await queryRunner.query(
      `ALTER TABLE "nfts" RENAME COLUMN "blockchainTypeId" TO "blockchainType"`,
    );
  }
}
