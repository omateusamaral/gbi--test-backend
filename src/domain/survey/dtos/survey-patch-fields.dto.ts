import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { TargetAudience } from '../interfaces/survey.interface';

export class SurveyPatchFieldsDto {
  @ApiProperty({ type: 'string', example: 'title' })
  @IsString()
  @IsOptional()
  @MinLength(5)
  title?: string;

  @ApiProperty({ type: 'enum', enum: TargetAudience })
  @IsEnum(TargetAudience)
  @IsOptional()
  targetAudience?: TargetAudience;

  @ApiProperty({ type: 'number', example: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  starRating?: number;
}
