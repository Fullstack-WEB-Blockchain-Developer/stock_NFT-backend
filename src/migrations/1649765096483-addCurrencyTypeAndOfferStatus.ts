import { MigrationInterface, QueryRunner } from 'typeorm';

export class addCurrencyTypeAndOfferStatus1649765096483
  implements MigrationInterface
{
  name = 'addCurrencyTypeAndOfferStatus1649765096483';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "offers" ADD "status" text NOT NULL DEFAULT 'pending'`,
    );
    await queryRunner.query(
      `ALTER TABLE "offers" ADD "currencyTypeId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "offers" ADD CONSTRAINT "FK_c93c7e1477dff5444bc655c3ce7" FOREIGN KEY ("currencyTypeId") REFERENCES "blockchain_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "offers" DROP CONSTRAINT "FK_c93c7e1477dff5444bc655c3ce7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "offers" DROP COLUMN "currencyTypeId"`,
    );
    await queryRunner.query(`ALTER TABLE "offers" DROP COLUMN "status"`);
  }
}
