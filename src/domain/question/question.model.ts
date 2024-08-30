import {
  Entity,
  Column,
  ManyToOne,
  BeforeInsert,
  Index,
  PrimaryColumn,
  JoinColumn,
} from 'typeorm';
import { Survey } from '../survey/survey.model';
import { v4 } from 'uuid';

@Entity()
export class Question {
  @PrimaryColumn()
  @Index()
  questionId: string;

  @Column()
  question: string;

  @ManyToOne(() => Survey, (survey) => survey.questions)
  @JoinColumn({
    name: 'surveyId',
  })
  survey: Survey;

  @BeforeInsert()
  setQuestionId() {
    this.questionId = v4();
  }
}
