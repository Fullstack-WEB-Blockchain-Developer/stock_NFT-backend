import { MigrationInterface, QueryRunner } from 'typeorm';

export class addCurrencyIcons1650346891095 implements MigrationInterface {
  name = 'addCurrencyIcons1650346891095';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "offer_currency_types" ADD "icon" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "collection_payment_tokens" ADD "icon" text`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "collection_payment_tokens" DROP COLUMN "icon"`,
    );
    await queryRunner.query(
      `ALTER TABLE "offer_currency_types" DROP COLUMN "icon"`,
    );
  }
}
