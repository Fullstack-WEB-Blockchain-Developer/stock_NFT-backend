import { MigrationInterface, QueryRunner } from 'typeorm';

export class constraintCorrectionNft1649143732495
  implements MigrationInterface
{
  name = 'constraintCorrectionNft1649143732495';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "nfts" DROP CONSTRAINT "FK_bb50714a04d932e9c191ce5bb7c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "nfts" ADD CONSTRAINT "FK_bb50714a04d932e9c191ce5bb7c" FOREIGN KEY ("blockchainTypeId") REFERENCES "blockchain_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "nfts" DROP CONSTRAINT "FK_bb50714a04d932e9c191ce5bb7c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "nfts" ADD CONSTRAINT "FK_bb50714a04d932e9c191ce5bb7c" FOREIGN KEY ("blockchainTypeId") REFERENCES "collections"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
