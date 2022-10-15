import { MigrationInterface, QueryRunner } from 'typeorm';

export class addListings1650617599928 implements MigrationInterface {
  name = 'addListings1650617599928';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "fixed_price_listings" ("id" SERIAL NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "price" double precision NOT NULL, "duration" date NOT NULL, "asBundle" boolean NOT NULL DEFAULT false, "bundleName" text, "bundleDescription" text, CONSTRAINT "PK_1b205d160bd082355c418ab7a30" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "time_auction_listings" ("id" SERIAL NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "startingPrice" double precision NOT NULL, "method" character varying NOT NULL DEFAULT 'highestBid', "duration" date NOT NULL, "reservePrice" double precision NOT NULL, CONSTRAINT "PK_94364d53c23917c4944ad18e66f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "nfts" ADD "fixedPriceListingId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "nfts" ADD "timeAuctionListingId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "nfts" ADD CONSTRAINT "FK_a4da90803ac37d22642fe8bb822" FOREIGN KEY ("fixedPriceListingId") REFERENCES "fixed_price_listings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "nfts" ADD CONSTRAINT "FK_a8bac4dd9cdfc58d0e730bce9f9" FOREIGN KEY ("timeAuctionListingId") REFERENCES "fixed_price_listings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "nfts" DROP CONSTRAINT "FK_a8bac4dd9cdfc58d0e730bce9f9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "nfts" DROP CONSTRAINT "FK_a4da90803ac37d22642fe8bb822"`,
    );
    await queryRunner.query(
      `ALTER TABLE "nfts" DROP COLUMN "timeAuctionListingId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "nfts" DROP COLUMN "fixedPriceListingId"`,
    );
    await queryRunner.query(`DROP TABLE "time_auction_listings"`);
    await queryRunner.query(`DROP TABLE "fixed_price_listings"`);
  }
}
