import { MigrationInterface, QueryRunner } from 'typeorm';

export class addUserInfo1648121467503 implements MigrationInterface {
  name = 'addUserInfo1648121467503';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "profileImage" text`);
    await queryRunner.query(`ALTER TABLE "users" ADD "bio" text`);
    await queryRunner.query(`ALTER TABLE "users" ADD "email" text`);
    await queryRunner.query(`ALTER TABLE "users" ADD "twitterLink" text`);
    await queryRunner.query(`ALTER TABLE "users" ADD "instagramLink" text`);
    await queryRunner.query(`ALTER TABLE "users" ADD "websiteLink" text`);
    await queryRunner.query(`ALTER TABLE "users" ADD "profileBanner" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "profileImage"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "profileBanner"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "websiteLink"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "instagramLink"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "twitterLink"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "bio"`);
  }
}
