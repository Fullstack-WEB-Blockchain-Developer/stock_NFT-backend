import { MigrationInterface, QueryRunner } from 'typeorm';

export class addUserRelationOffers1649415996122 implements MigrationInterface {
  name = 'addUserRelationOffers1649415996122';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "offers" ADD "userId" integer`);
    await queryRunner.query(
      `ALTER TABLE "offers" ADD CONSTRAINT "FK_dee629b1248f4ad48268faa9ea1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "offers" DROP CONSTRAINT "FK_dee629b1248f4ad48268faa9ea1"`,
    );
    await queryRunner.query(`ALTER TABLE "offers" DROP COLUMN "userId"`);
  }
}
