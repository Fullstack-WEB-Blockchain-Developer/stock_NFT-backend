import { MigrationInterface, QueryRunner } from 'typeorm';

export class addCurrencyTypesAndPaymentTokensAndNotificaitons1649934311116
  implements MigrationInterface
{
  name = 'addCurrencyTypesAndPaymentTokensAndNotificaitons1649934311116';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "offers" DROP CONSTRAINT "FK_c93c7e1477dff5444bc655c3ce7"`,
    );
    await queryRunner.query(
      `CREATE TABLE "offer_currency_types" ("id" SERIAL NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" text NOT NULL, CONSTRAINT "UQ_f4f830ab807830dbb91a4a56604" UNIQUE ("name"), CONSTRAINT "PK_2d3dd26d20add31afaeb4810485" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "collection_payment_tokens" ("id" SERIAL NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" text NOT NULL, CONSTRAINT "UQ_d67d6a4fe2ccf4d74cc3d04b4dd" UNIQUE ("name"), CONSTRAINT "PK_6a4beb49be65900512ffdd89bcb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."notifications_type_enum" AS ENUM('itemSold', 'bidActivity', 'priceChange', 'auctionExpiration', 'outbid', 'ownedItemsUpdates', 'successfulPurchase', 'stokeNftNewsletter', 'minBindThreshold', 'other')`,
    );
    await queryRunner.query(
      `CREATE TABLE "notifications" ("id" SERIAL NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "text" text, "type" "public"."notifications_type_enum", "userId" integer, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "collections" ADD "websiteLink" text`);
    await queryRunner.query(`ALTER TABLE "collections" ADD "discordLink" text`);
    await queryRunner.query(
      `ALTER TABLE "collections" ADD "instagramLink" text`,
    );
    await queryRunner.query(`ALTER TABLE "collections" ADD "mediumLink" text`);
    await queryRunner.query(
      `ALTER TABLE "collections" ADD "telegramLink" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "collections" ADD "creatorEarnings" double precision`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."collections_displaytheme_enum" AS ENUM('padded', 'contained', 'covered')`,
    );
    await queryRunner.query(
      `ALTER TABLE "collections" ADD "displayTheme" "public"."collections_displaytheme_enum" NOT NULL DEFAULT 'contained'`,
    );
    await queryRunner.query(
      `ALTER TABLE "collections" ADD "IsSensitiveContent" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "collections" ADD "collaborators" jsonb array`,
    );
    await queryRunner.query(
      `ALTER TABLE "collections" ADD "paymentTokenId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "notificationSettings" jsonb NOT NULL DEFAULT '{"itemSold":true,"bidActivity":true,"priceChange":true,"auctionExpiration":true,"outbid":true,"ownedItemsUpdates":true,"successfulPurchase":true,"stokeNftNewsletter":true,"minBindThreshold":true}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "isTransferApproved" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(`ALTER TABLE "offers" DROP COLUMN "status"`);
    await queryRunner.query(
      `CREATE TYPE "public"."offers_status_enum" AS ENUM('pending', 'accepted', 'declined')`,
    );
    await queryRunner.query(
      `ALTER TABLE "offers" ADD "status" "public"."offers_status_enum" NOT NULL DEFAULT 'pending'`,
    );
    await queryRunner.query(
      `ALTER TABLE "offers" ADD CONSTRAINT "FK_c93c7e1477dff5444bc655c3ce7" FOREIGN KEY ("currencyTypeId") REFERENCES "offer_currency_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "collections" ADD CONSTRAINT "FK_d9016273a0c3a2376b8cbd13908" FOREIGN KEY ("paymentTokenId") REFERENCES "collection_payment_tokens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "FK_692a909ee0fa9383e7859f9b406" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT "FK_692a909ee0fa9383e7859f9b406"`,
    );
    await queryRunner.query(
      `ALTER TABLE "collections" DROP CONSTRAINT "FK_d9016273a0c3a2376b8cbd13908"`,
    );
    await queryRunner.query(
      `ALTER TABLE "offers" DROP CONSTRAINT "FK_c93c7e1477dff5444bc655c3ce7"`,
    );
    await queryRunner.query(`ALTER TABLE "offers" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "public"."offers_status_enum"`);
    await queryRunner.query(
      `ALTER TABLE "offers" ADD "status" text NOT NULL DEFAULT 'pending'`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "isTransferApproved"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "notificationSettings"`,
    );
    await queryRunner.query(
      `ALTER TABLE "collections" DROP COLUMN "paymentTokenId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "collections" DROP COLUMN "collaborators"`,
    );
    await queryRunner.query(
      `ALTER TABLE "collections" DROP COLUMN "IsSensitiveContent"`,
    );
    await queryRunner.query(
      `ALTER TABLE "collections" DROP COLUMN "displayTheme"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."collections_displaytheme_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "collections" DROP COLUMN "creatorEarnings"`,
    );
    await queryRunner.query(
      `ALTER TABLE "collections" DROP COLUMN "telegramLink"`,
    );
    await queryRunner.query(
      `ALTER TABLE "collections" DROP COLUMN "mediumLink"`,
    );
    await queryRunner.query(
      `ALTER TABLE "collections" DROP COLUMN "instagramLink"`,
    );
    await queryRunner.query(
      `ALTER TABLE "collections" DROP COLUMN "discordLink"`,
    );
    await queryRunner.query(
      `ALTER TABLE "collections" DROP COLUMN "websiteLink"`,
    );
    await queryRunner.query(`DROP TABLE "notifications"`);
    await queryRunner.query(`DROP TYPE "public"."notifications_type_enum"`);
    await queryRunner.query(`DROP TABLE "collection_payment_tokens"`);
    await queryRunner.query(`DROP TABLE "offer_currency_types"`);
    await queryRunner.query(
      `ALTER TABLE "offers" ADD CONSTRAINT "FK_c93c7e1477dff5444bc655c3ce7" FOREIGN KEY ("currencyTypeId") REFERENCES "blockchain_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
