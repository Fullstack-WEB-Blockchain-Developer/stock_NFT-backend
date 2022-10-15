import { MigrationInterface, QueryRunner } from 'typeorm';

export class collectionUserRelation1649061488120 implements MigrationInterface {
  name = 'collectionUserRelation1649061488120';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "collections" ADD "userId" integer`);
    await queryRunner.query(
      `ALTER TABLE "collections" ADD CONSTRAINT "FK_da613d6625365707f8df0f65d81" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "collections" DROP CONSTRAINT "FK_da613d6625365707f8df0f65d81"`,
    );
    await queryRunner.query(`ALTER TABLE "collections" DROP COLUMN "userId"`);
  }
}
