import { Module } from '@nestjs/common';
import { ResponseService } from './response.service';
import { DomainModule } from '../domain.module';
import { QuestionModule } from '../question/question.module';
import { SurveyModule } from '../survey';

@Module({
  imports: [DomainModule.register(), SurveyModule, QuestionModule],
  providers: [ResponseService],
  exports: [ResponseService],
})
export class ResponseModule {}
