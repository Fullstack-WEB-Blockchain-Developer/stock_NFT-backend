import { MigrationInterface, QueryRunner } from 'typeorm';

export class addIpfsLinkNft1649154250966 implements MigrationInterface {
  name = 'addIpfsLinkNft1649154250966';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "nfts" ADD "ipfsLink" text`);
    await queryRunner.query(
      `CREATE TYPE "public"."nfts_status_enum" AS ENUM('pending', 'approved', 'listed')`,
    );
    await queryRunner.query(
      `ALTER TABLE "nfts" ADD "status" "public"."nfts_status_enum" NOT NULL DEFAULT 'pending'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "nfts" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "public"."nfts_status_enum"`);
    await queryRunner.query(`ALTER TABLE "nfts" DROP COLUMN "ipfsLink"`);
  }
}
