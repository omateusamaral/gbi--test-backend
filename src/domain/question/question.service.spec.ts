import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { QuestionService } from './question.service';
import { Question } from './question.model';
import { SurveyService } from '../survey';

const mockQuestionRepository = () => ({
  findOne: jest.fn(),
  insert: jest.fn(),
  find: jest.fn(),
});

describe('QuestionService', () => {
  let service: QuestionService;
  let questionRepository: Repository<Question>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionService,
        {
          provide: getRepositoryToken(Question),
          useFactory: mockQuestionRepository,
        },
        {
          provide: SurveyService,
          useFactory: () => ({
            getSurvey: jest.fn(),
          }),
        },
      ],
    }).compile();

    service = module.get<QuestionService>(QuestionService);
    questionRepository = module.get<Repository<Question>>(
      getRepositoryToken(Question),
    );
  });

  describe('getQuestion', () => {
    it('should return a question if found', async () => {
      //Arrange
      const mockQuestion = { questionId: '1', question: 'Teste' } as Question;

      jest.spyOn(questionRepository, 'findOne').mockResolvedValue(mockQuestion);

      //Act
      const result = await service.getQuestion('1');

      //Assert
      expect(result).toEqual(mockQuestion);
    });

    it('should throw NotFoundException if question is not found', async () => {
      //Arrange
      jest.spyOn(questionRepository, 'findOne').mockResolvedValue(null);

      //Act && Assert
      await expect(service.getQuestion('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('createQuestion', () => {
    it('should insert required questions if not already inserted', async () => {
      jest.spyOn(questionRepository, 'find').mockResolvedValue([]);
      jest.spyOn(questionRepository, 'insert').mockResolvedValue(undefined);

      await service.createQuestion('1');

      expect(questionRepository.insert).toHaveBeenCalledTimes(
        service.REQUIRED_QUESTIONS.length,
      );
    });

    it('should not insert questions if already inserted', async () => {
      jest
        .spyOn(questionRepository, 'find')
        .mockResolvedValue(service.REQUIRED_QUESTIONS as any);

      await service.createQuestion('1');

      expect(questionRepository.insert).not.toHaveBeenCalled();
    });
  });
});
