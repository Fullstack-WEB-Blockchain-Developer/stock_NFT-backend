import { MigrationInterface, QueryRunner } from 'typeorm';

export class addCollectionCategories1650862417144
  implements MigrationInterface
{
  name = 'addCollectionCategories1650862417144';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "collections" RENAME COLUMN "category" TO "categoryId"`,
    );
    await queryRunner.query(
      `CREATE TABLE "collection_categories" ("id" SERIAL NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" text NOT NULL, "icon" text, CONSTRAINT "UQ_8aacb9b0c70667dd5c26fbe45df" UNIQUE ("name"), CONSTRAINT "PK_7d607ba6de4c733d3129ff2835f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "offers" ADD "blockchainHash" text`);
    await queryRunner.query(`ALTER TABLE "nfts" ADD "price" double precision`);
    await queryRunner.query(
      `ALTER TABLE "collections" DROP COLUMN "categoryId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "collections" ADD "categoryId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "collections" ADD CONSTRAINT "FK_b78f4958160c05bbb1da836262b" FOREIGN KEY ("categoryId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "collections" DROP CONSTRAINT "FK_b78f4958160c05bbb1da836262b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "collections" DROP COLUMN "categoryId"`,
    );
    await queryRunner.query(`ALTER TABLE "collections" ADD "categoryId" text`);
    await queryRunner.query(`ALTER TABLE "nfts" DROP COLUMN "price"`);
    await queryRunner.query(
      `ALTER TABLE "offers" DROP COLUMN "blockchainHash"`,
    );
    await queryRunner.query(`DROP TABLE "collection_categories"`);
    await queryRunner.query(
      `ALTER TABLE "collections" RENAME COLUMN "categoryId" TO "category"`,
    );
  }
}
