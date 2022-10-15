import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config({ path: `.test.env` });

export const typeOrmModuleOptions: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT) || 5433,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_NAME,
  entities: [__dirname + '/../**/entities/*.entity.{ts,js}'],
  synchronize: true,
  autoLoadEntities: true,
  migrationsRun: true,
};

export const OrmConfig = {
  ...typeOrmModuleOptions,
  migrationsTableName: 'migrations',
  migrations: ['src/migrations/*.ts'],
  cli: {
    migrationsDir: 'src/migrations',
  },
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT) || 5433,
  usersname: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_NAME,
};
export default OrmConfig;
