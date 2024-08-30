import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { QuestionModule } from './domain/question/question.module';
import { ResponseModule } from './domain/response/response.module';
import { SurveyModule } from './domain/survey';
import { AppController } from './app.controller';
import { DomainModule } from './domain/domain.module';
import { CsvModule } from './csv/csv.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SurveyModule,
    QuestionModule,
    ResponseModule,
    DomainModule,
    CsvModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    },
  ],
  controllers: [AppController],
})
export class AppModule {}
