import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResponseService } from './response.service';
import { SurveyService, TargetAudience } from '../survey';
import { QuestionService } from '../question/question.service';
import { Response } from './response.model';
import { Survey } from '../survey/survey.model';
import { Question } from '../question/question.model';
import { ResponseCreateFieldsDto } from './dtos/response-create-fields.dto';
import { OrderBy } from './interfaces/response.interface';

const mockResponseRepository = () => ({
  findOne: jest.fn(),
  insert: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    leftJoinAndSelect: jest.fn(() => ({
      leftJoinAndSelect: jest.fn(() => ({
        where: jest.fn(() => ({
          orderBy: jest.fn(() => ({
            distinct: jest.fn(() => ({
              getMany: jest.fn().mockResolvedValue([
                {
                  answer: 'answer',
                  createdAt: new Date(),
                  question: {
                    question: 'question',
                    questionId: 'questionId',
                    survey: {
                      questions: [],
                      createdAt: new Date(),
                      starRating: 5,
                      responses: [],
                      surveyId: '123',
                      targetAudience: TargetAudience.ATHLETES,
                      title: 'title',
                    },
                  },
                },
              ]),
            })),
          })),
        })),
      })),
    })),
  })),
});

const mockSurveyService = () => ({
  getSurvey: jest.fn(),
  patchSurvey: jest.fn(),
});

const mockQuestionService = () => ({
  getQuestion: jest.fn(),
  REQUIRED_QUESTIONS: [{ question: 'Quantidade de estrelas' }],
});

describe('ResponseService', () => {
  let service: ResponseService;
  let responseRepository: Repository<Response>;
  let surveyService: SurveyService;
  let questionService: QuestionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResponseService,
        {
          provide: getRepositoryToken(Response),
          useFactory: mockResponseRepository,
        },
        {
          provide: SurveyService,
          useFactory: mockSurveyService,
        },
        {
          provide: QuestionService,
          useFactory: mockQuestionService,
        },
      ],
    }).compile();

    service = module.get<ResponseService>(ResponseService);
    responseRepository = module.get<Repository<Response>>(
      getRepositoryToken(Response),
    );
    surveyService = module.get<SurveyService>(SurveyService);
    questionService = module.get<QuestionService>(QuestionService);
  });

  describe('createResponse', () => {
    it('should create and return a response', async () => {
      //Arrange
      const mockSurvey = { surveyId: '1', starRating: 3 } as Survey;
      const mockQuestion = {
        questionId: '1',
        question: 'Quantidade de estrelas',
      } as Question;
      const mockResponse = { identifiers: [{ responseId: '1' }] } as any;

      jest.spyOn(surveyService, 'getSurvey').mockResolvedValue(mockSurvey);
      jest
        .spyOn(questionService, 'getQuestion')
        .mockResolvedValue(mockQuestion);
      jest.spyOn(responseRepository, 'insert').mockResolvedValue(mockResponse);
      jest.spyOn(responseRepository, 'findOne').mockResolvedValue(mockResponse);

      const createFieldsDto: ResponseCreateFieldsDto = {
        questionId: '1',
        answer: '5',
      };

      //Act
      const result = await service.createResponse('1', createFieldsDto);

      //Assert
      expect(result).toEqual(mockResponse);
      expect(responseRepository.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          ...createFieldsDto,
          survey: mockSurvey,
          question: mockQuestion,
        }),
      );
      expect(surveyService.patchSurvey).toHaveBeenCalledWith('1', {
        starRating: 8,
      });
    });
  });

  describe('listResponse', () => {
    it('should return a list of responses based on targetAudience and orderBy', async () => {
      //Arrange

      //Act
      const result = await service.listResponse(
        TargetAudience.GEEKS,
        OrderBy.DESC,
      );

      //Assert
      expect(result).toEqual([
        {
          answer: 'answer',
          createdAt: expect.any(Date),
          question: {
            question: 'question',
            questionId: 'questionId',
            survey: {
              questions: [],
              createdAt: expect.any(Date),
              starRating: 5,
              responses: [],
              surveyId: '123',
              targetAudience: TargetAudience.ATHLETES,
              title: 'title',
            },
          },
        },
      ]);
      expect(responseRepository.createQueryBuilder).toHaveBeenCalled();
    });
  });
});
