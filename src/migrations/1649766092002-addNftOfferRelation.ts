import { MigrationInterface, QueryRunner } from 'typeorm';

export class addNftOfferRelation1649766092002 implements MigrationInterface {
  name = 'addNftOfferRelation1649766092002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "offers" ADD "nftId" integer`);
    await queryRunner.query(
      `ALTER TABLE "offers" ADD CONSTRAINT "FK_27c21674b5d3fed069b5492f9ad" FOREIGN KEY ("nftId") REFERENCES "nfts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "offers" DROP CONSTRAINT "FK_27c21674b5d3fed069b5492f9ad"`,
    );
    await queryRunner.query(`ALTER TABLE "offers" DROP COLUMN "nftId"`);
  }
}
