import { MigrationInterface, QueryRunner } from 'typeorm';

export class addNftCreatorAndBlockchainIcon1650455273340
  implements MigrationInterface
{
  name = 'addNftCreatorAndBlockchainIcon1650455273340';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "nfts" DROP CONSTRAINT "FK_aaf2a9cd8392258b38fcf049a7f"`,
    );
    await queryRunner.query(`ALTER TABLE "nfts" DROP COLUMN "userId"`);
    await queryRunner.query(`ALTER TABLE "blockchain_types" ADD "icon" text`);
    await queryRunner.query(`ALTER TABLE "nfts" ADD "ownerId" integer`);
    await queryRunner.query(`ALTER TABLE "nfts" ADD "creatorId" integer`);
    await queryRunner.query(
      `ALTER TABLE "nfts" ADD CONSTRAINT "FK_83b61e0493f2646d2a299a4e14e" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "nfts" ADD CONSTRAINT "FK_c9898b6eb9a714f7ab9c1b7fa09" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "nfts" DROP CONSTRAINT "FK_c9898b6eb9a714f7ab9c1b7fa09"`,
    );
    await queryRunner.query(
      `ALTER TABLE "nfts" DROP CONSTRAINT "FK_83b61e0493f2646d2a299a4e14e"`,
    );
    await queryRunner.query(`ALTER TABLE "nfts" DROP COLUMN "creatorId"`);
    await queryRunner.query(`ALTER TABLE "nfts" DROP COLUMN "ownerId"`);
    await queryRunner.query(
      `ALTER TABLE "blockchain_types" DROP COLUMN "icon"`,
    );
    await queryRunner.query(`ALTER TABLE "nfts" ADD "userId" integer`);
    await queryRunner.query(
      `ALTER TABLE "nfts" ADD CONSTRAINT "FK_aaf2a9cd8392258b38fcf049a7f" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
