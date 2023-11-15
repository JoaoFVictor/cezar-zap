import 'dotenv/config';

import { DataSource, DataSourceOptions } from 'typeorm';

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT!),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  logging: false,
  synchronize: true,
  entities: ['src/application/entities/*.ts'],
  migrations: ['src/infrastructure/database/migration/*.ts'],
};

const AppDataSource = new DataSource(dataSourceOptions);
export { AppDataSource };
