import {
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { toCsv } from '@iwsio/json-csv-node';
import { ResponseService, TargetAudience } from '../domain';
import { OrderBy } from '../domain/response/interfaces/response.interface';

@Injectable()
export class CSVService {
  private readonly logger = new Logger(CSVService.name);

  constructor(private readonly responseService: ResponseService) {}

  public async export(targetAudience: TargetAudience) {
    try {
      const data = await this.responseService.listResponse(
        targetAudience,
        OrderBy.DESC,
      );
      return await toCsv(data, {
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      this.logger.error(`${CSVService.name} - ${error}`);
      throw new UnprocessableEntityException(
        'Não foi possível processar o CSV',
      );
    }
  }
}
