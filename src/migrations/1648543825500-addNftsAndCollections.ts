import { MigrationInterface, QueryRunner } from 'typeorm';

export class addNftsAndCollections1648543825500 implements MigrationInterface {
  name = 'addNftsAndCollections1648543825500';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "nfts" ("id" SERIAL NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" text NOT NULL, "fileName" text NOT NULL, "externalLink" text, "description" text NOT NULL, "properties" jsonb array, "levels" jsonb array, "stats" jsonb array, "unlockableContent" text, "isSensitiveContent" boolean NOT NULL DEFAULT false, "isAssetBacked" boolean NOT NULL DEFAULT false, "blockchainType" text NOT NULL, "collectionId" integer, CONSTRAINT "PK_65562dd9630b48c4d4710d66772" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "collections" ("id" SERIAL NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" text NOT NULL, CONSTRAINT "UQ_ed225078e8bf65b448b69105b45" UNIQUE ("name"), CONSTRAINT "PK_21c00b1ebbd41ba1354242c5c4e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "nfts" ADD CONSTRAINT "FK_4848981bd60a8c7e4df437366b5" FOREIGN KEY ("collectionId") REFERENCES "collections"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "nfts" DROP CONSTRAINT "FK_4848981bd60a8c7e4df437366b5"`,
    );
    await queryRunner.query(`DROP TABLE "collections"`);
    await queryRunner.query(`DROP TABLE "nfts"`);
  }
}
