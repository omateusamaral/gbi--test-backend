import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  BeforeInsert,
  Index,
  OneToMany,
} from 'typeorm';
import { v4 } from 'uuid';
import { TargetAudience } from './interfaces/survey.interface';
import { Question } from '../question/question.model';
import { Response } from '../response/response.model';

@Entity({ name: 'survey' })
export class Survey {
  @PrimaryColumn()
  @Index()
  public surveyId: string;

  @Column()
  @Index()
  public title: string;

  @Column({ type: 'int', default: 0 })
  starRating: number;

  @Column({
    enum: TargetAudience,
  })
  public targetAudience: TargetAudience;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Question, (question) => question.survey, { cascade: true })
  questions: Question[];

  @OneToMany(() => Response, (response) => response.survey)
  responses: Response[];

  @BeforeInsert()
  setSurveyId() {
    this.surveyId = v4();
  }
}
