import { MigrationInterface, QueryRunner } from 'typeorm';

export class addFavNftsJoinTable1650523229849 implements MigrationInterface {
  name = 'addFavNftsJoinTable1650523229849';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users_favorited_nfts_nfts" ("usersId" integer NOT NULL, "nftsId" integer NOT NULL, CONSTRAINT "PK_cefd9ea0d172f9e427cf0198253" PRIMARY KEY ("usersId", "nftsId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6cba0aad3df6c14ff120d0bea8" ON "users_favorited_nfts_nfts" ("usersId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6dbc8c57eaff780abf23c34602" ON "users_favorited_nfts_nfts" ("nftsId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "users_favorited_nfts_nfts" ADD CONSTRAINT "FK_6cba0aad3df6c14ff120d0bea86" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_favorited_nfts_nfts" ADD CONSTRAINT "FK_6dbc8c57eaff780abf23c346020" FOREIGN KEY ("nftsId") REFERENCES "nfts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users_favorited_nfts_nfts" DROP CONSTRAINT "FK_6dbc8c57eaff780abf23c346020"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_favorited_nfts_nfts" DROP CONSTRAINT "FK_6cba0aad3df6c14ff120d0bea86"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6dbc8c57eaff780abf23c34602"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6cba0aad3df6c14ff120d0bea8"`,
    );
    await queryRunner.query(`DROP TABLE "users_favorited_nfts_nfts"`);
  }
}
