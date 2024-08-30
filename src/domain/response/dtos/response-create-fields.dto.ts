import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResponseCreateFieldsDto {
  @ApiProperty({ type: 'string', example: 'title' })
  @IsString()
  @IsNotEmpty()
  answer: string;

  @ApiProperty({ type: 'string', example: 'questionId' })
  @IsNotEmpty()
  @IsString()
  questionId: string;
}
