import { Test, TestingModule } from '@nestjs/testing';
import { CSVService } from './csv.service';
import { UnprocessableEntityException } from '@nestjs/common';
import { toCsv } from '@iwsio/json-csv-node';
import { ResponseService, TargetAudience } from '../domain';

jest.mock('@iwsio/json-csv-node');

describe('CSVService', () => {
  let service: CSVService;
  let responseService: ResponseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CSVService,
        {
          provide: ResponseService,
          useValue: {
            listResponse: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CSVService>(CSVService);
    responseService = module.get<ResponseService>(ResponseService);
  });

  it('should export CSV with correct data', async () => {
    //Arrange
    const mockData = [
      {
        title: 'Survey 1',
        starRating: 5,
        question: 'question?',
        answer: 'answer.',
      },
    ];
    const mockCsv =
      'Identificação,Título,Avaliação,E-mail,Criado em,Atualizado At\n1,Survey 1,5,test@example.com,29/08/2024 09:00,29/08/2024 10:00\n';

    (responseService.listResponse as jest.Mock).mockResolvedValue(mockData);
    (toCsv as jest.Mock).mockResolvedValue(mockCsv);

    //Act
    const result = await service.export(TargetAudience.GEEKS);

    //Assert
    expect(result).toBe(mockCsv);
    expect(responseService.listResponse).toHaveBeenCalledTimes(1);
    expect(toCsv).toHaveBeenCalledWith(mockData, {
      fields: [
        {
          name: 'survey.title',

          label: 'Pesquisa',
        },

        {
          name: 'question.question',

          label: 'Questão',
        },

        {
          name: 'answer',

          label: 'Resposta',
        },
        {
          name: 'survey.starRating',

          label: 'Avaliação Final da Pesquisa',
        },
      ],
      fieldSeparator: ',',
      ignoreHeader: false,
    });
  });

  it('should throw an UnprocessableEntityException if an error occurs', async () => {
    //Arrange
    (responseService.listResponse as jest.Mock).mockRejectedValue(new Error());

    //Act && Assert
    await expect(service.export(TargetAudience.SPORTSMEN)).rejects.toThrow(
      UnprocessableEntityException,
    );
  });
});
