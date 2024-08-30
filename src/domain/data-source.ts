import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Gen1724987873699 } from '../migration/1724987873699-gen';
import { Question } from './question/question.model';
import { Survey } from './survey/survey.model';
import { Response } from './response/response.model';
import { Gen1725018472550 } from '../migration/1725018472550-gen';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'postgres',
  database: 'postgres',
  synchronize: false,
  logging: false,
  entities: [Survey, Question, Response],
  migrations: [Gen1724987873699, Gen1725018472550],
  migrationsRun: true,
});
