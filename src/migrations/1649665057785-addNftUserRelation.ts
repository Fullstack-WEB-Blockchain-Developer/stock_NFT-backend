import { MigrationInterface, QueryRunner } from 'typeorm';

export class addNftUserRelation1649665057785 implements MigrationInterface {
  name = 'addNftUserRelation1649665057785';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "nfts" ADD "userId" integer`);
    await queryRunner.query(
      `ALTER TABLE "nfts" ADD CONSTRAINT "FK_aaf2a9cd8392258b38fcf049a7f" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "nfts" DROP CONSTRAINT "FK_aaf2a9cd8392258b38fcf049a7f"`,
    );
    await queryRunner.query(`ALTER TABLE "nfts" DROP COLUMN "userId"`);
  }
}
