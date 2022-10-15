import { MigrationInterface, QueryRunner } from 'typeorm';

export class changeOfferPriceType1649827485726 implements MigrationInterface {
  name = 'changeOfferPriceType1649827485726';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "offers" DROP COLUMN "quantity"`);
    await queryRunner.query(`ALTER TABLE "offers" DROP COLUMN "price"`);
    await queryRunner.query(
      `ALTER TABLE "offers" ADD "price" double precision NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "offers" DROP COLUMN "price"`);
    await queryRunner.query(
      `ALTER TABLE "offers" ADD "price" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "offers" ADD "quantity" integer NOT NULL`,
    );
  }
}
