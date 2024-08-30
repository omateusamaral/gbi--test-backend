import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './data-source';
import { Question } from './question/question.model';
import { Survey } from './survey/survey.model';
import { Response } from './response/response.model';

@Module({})
export class DomainModule {
  static register(): DynamicModule {
    return {
      module: DomainModule,
      imports: [
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => {
            const url = configService.get('DB_CONNECTION_STRING');
            return {
              ...AppDataSource.options,
              url,
            };
          },
          inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([Survey, Question, Response]),
      ],
      exports: [TypeOrmModule],
    };
  }
}
