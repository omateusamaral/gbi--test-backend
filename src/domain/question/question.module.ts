import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { DomainModule } from '../domain.module';
import { SurveyModule } from '../survey';

@Module({
  imports: [DomainModule.register(), SurveyModule],
  providers: [QuestionService],
  exports: [QuestionService],
})
export class QuestionModule {}
