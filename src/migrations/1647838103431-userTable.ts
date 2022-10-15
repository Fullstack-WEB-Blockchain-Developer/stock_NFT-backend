import { MigrationInterface, QueryRunner } from 'typeorm';

export class usersTable1647838103431 implements MigrationInterface {
  name = 'usersTable1647838103431';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "nonce" integer NOT NULL, "publicAddress" text NOT NULL, "username" text, CONSTRAINT "UQ_764606159294aeed20628413590" UNIQUE ("publicAddress"), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
