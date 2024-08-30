import { Module } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { DomainModule } from '../domain.module';

@Module({
  imports: [DomainModule.register()],
  providers: [SurveyService],
  exports: [SurveyService],
})
export class SurveyModule {}
