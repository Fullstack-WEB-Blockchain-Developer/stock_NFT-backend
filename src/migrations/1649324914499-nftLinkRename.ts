import { MigrationInterface, QueryRunner } from 'typeorm';

export class nftLinkRename1649324914499 implements MigrationInterface {
  name = 'nftLinkRename1649324914499';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "nfts" RENAME COLUMN "ipfsLink" TO "nftMediaLink"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "nfts" RENAME COLUMN "nftMediaLink" TO "ipfsLink"`,
    );
  }
}
