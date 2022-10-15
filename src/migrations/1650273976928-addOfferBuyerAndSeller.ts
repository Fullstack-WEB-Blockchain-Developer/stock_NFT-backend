import { MigrationInterface, QueryRunner } from 'typeorm';

export class addOfferBuyerAndSeller1650273976928 implements MigrationInterface {
  name = 'addOfferBuyerAndSeller1650273976928';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "offers" DROP CONSTRAINT "FK_dee629b1248f4ad48268faa9ea1"`,
    );
    await queryRunner.query(`ALTER TABLE "offers" DROP COLUMN "userId"`);
    await queryRunner.query(`ALTER TABLE "offers" ADD "buyerId" integer`);
    await queryRunner.query(`ALTER TABLE "offers" ADD "sellerId" integer`);
    await queryRunner.query(
      `ALTER TABLE "offers" ADD CONSTRAINT "FK_31bca9f7753201479da158d51a3" FOREIGN KEY ("buyerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "offers" ADD CONSTRAINT "FK_92de52b4c607bdf9b4f64f40017" FOREIGN KEY ("sellerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "offers" DROP CONSTRAINT "FK_92de52b4c607bdf9b4f64f40017"`,
    );
    await queryRunner.query(
      `ALTER TABLE "offers" DROP CONSTRAINT "FK_31bca9f7753201479da158d51a3"`,
    );
    await queryRunner.query(`ALTER TABLE "offers" DROP COLUMN "sellerId"`);
    await queryRunner.query(`ALTER TABLE "offers" DROP COLUMN "buyerId"`);
    await queryRunner.query(`ALTER TABLE "offers" ADD "userId" integer`);
    await queryRunner.query(
      `ALTER TABLE "offers" ADD CONSTRAINT "FK_dee629b1248f4ad48268faa9ea1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
