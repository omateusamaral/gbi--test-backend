import { Injectable, NotFoundException } from '@nestjs/common';
import { Question } from './question.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { Survey } from '../survey/survey.model';
import { OnEvent } from '@nestjs/event-emitter';
import { SurveyService } from '../survey';

@Injectable()
export class QuestionService {
  public readonly REQUIRED_QUESTIONS = [
    { question: 'Quantidade de estrelas' },
    { question: 'Público-alvo' },
    { question: 'E-mail para contato' },
  ];
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    private readonly surveyService: SurveyService,
  ) {}

  public async getQuestion(questionId: string): Promise<Question> {
    const survey = await this.questionRepository.findOne({
      where: {
        questionId,
      },
    });

    if (!survey) {
      throw new NotFoundException(`Pesquisa ${questionId} não encontrada`);
    }

    return survey;
  }
  @OnEvent('survey.created')
  async createQuestion(surveyId: string): Promise<void> {
    const survey = await this.surveyService.getSurvey(surveyId);
    if (await this.alreadyInserted(survey)) {
      return;
    }
    for (const { question } of this.REQUIRED_QUESTIONS) {
      const questionPlainToClass = plainToClass(Question, {
        question,
        survey,
      });
      await this.questionRepository.insert(questionPlainToClass);
    }
  }

  private async alreadyInserted(survey: Survey): Promise<boolean> {
    const response = await this.questionRepository.find({
      where: {
        survey: survey,
      },
    });

    return this.REQUIRED_QUESTIONS.every((req) =>
      response.some((value) => value.question === req.question),
    );
  }
}
