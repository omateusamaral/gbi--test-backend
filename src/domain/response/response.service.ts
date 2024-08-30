import { Injectable, NotFoundException } from '@nestjs/common';
import { Response } from './response.model';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Repository } from 'typeorm';
import { ResponseCreateFieldsDto } from './dtos/response-create-fields.dto';
import { SurveyService } from '../survey';
import { QuestionService } from '../question/question.service';
import { TargetAudience } from '../survey/interfaces/survey.interface';
import { OrderBy } from './interfaces/response.interface';
import { Question } from '../question/question.model';
import { Survey } from '../survey/survey.model';

@Injectable()
export class ResponseService {
  constructor(
    @InjectRepository(Response)
    private readonly responseRepository: Repository<Response>,
    private readonly surveyService: SurveyService,
    private readonly questionService: QuestionService,
  ) {}

  private async getResponse(responseId: string): Promise<Response> {
    const response = await this.responseRepository.findOne({
      where: {
        responseId,
      },
      relations: ['question', 'survey'],
    });

    if (!response) {
      throw new NotFoundException(`Resposta ${responseId} não encontrada`);
    }

    return response;
  }

  async createResponse(
    surveyId: string,
    responseCreateFields: ResponseCreateFieldsDto,
  ): Promise<Response> {
    const [survey, question] = await Promise.all([
      this.surveyService.getSurvey(surveyId),
      this.questionService.getQuestion(responseCreateFields.questionId),
    ]);

    const responsePlainToClass = plainToClass(Response, {
      ...responseCreateFields,
      survey,
      question,
    });

    const response = await this.responseRepository.insert(responsePlainToClass);

    if (this.isRatingQuestion(question)) {
      const surveyPlainToClass = plainToClass(Survey, {
        starRating: survey.starRating + Number(responseCreateFields.answer),
      });

      await this.surveyService.patchSurvey(surveyId, surveyPlainToClass);
    }
    return await this.getResponse(response.identifiers[0].responseId);
  }

  async listResponse(
    targetAudience: TargetAudience,
    orderBy: OrderBy,
  ): Promise<Response[]> {
    return await this.responseRepository
      .createQueryBuilder('response')
      .leftJoinAndSelect('response.question', 'question')
      .leftJoinAndSelect('response.survey', 'survey')
      .where('survey.targetAudience = :targetAudience', { targetAudience })
      .orderBy('survey.starRating', orderBy)
      .distinct(true)
      .getMany();
  }

  private isRatingQuestion({ question }: Question): boolean {
    return question === this.questionService.REQUIRED_QUESTIONS[0].question;
  }
}
