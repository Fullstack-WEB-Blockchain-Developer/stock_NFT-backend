import { MigrationInterface, QueryRunner } from 'typeorm';

export class addOffers1649313124535 implements MigrationInterface {
  name = 'addOffers1649313124535';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "offers" ("id" SERIAL NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "quantity" integer NOT NULL, "price" integer NOT NULL, "expirationDate" date NOT NULL, CONSTRAINT "PK_4c88e956195bba85977da21b8f4" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "offers"`);
  }
}
