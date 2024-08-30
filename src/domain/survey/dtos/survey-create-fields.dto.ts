import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { TargetAudience } from '../interfaces/survey.interface';

export class SurveyCreateFieldsDto {
  @ApiProperty({ type: 'string', example: 'title' })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  title: string;

  @ApiProperty({ type: 'enum', enum: TargetAudience })
  @IsEnum(TargetAudience)
  @IsNotEmpty()
  targetAudience: TargetAudience;
}
