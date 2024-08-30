import { Module } from '@nestjs/common';
import { CSVService } from './csv.service';
import { ResponseModule } from '../domain';

@Module({
  imports: [ResponseModule],
  providers: [CSVService],
  exports: [CSVService],
})
export class CsvModule {}
