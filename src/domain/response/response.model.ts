import {
  Entity,
  Column,
  ManyToOne,
  CreateDateColumn,
  BeforeInsert,
  Index,
  PrimaryColumn,
  JoinColumn,
} from 'typeorm';
import { Survey } from '../survey/survey.model';
import { v4 } from 'uuid';
import { Question } from '../question/question.model';

@Entity()
export class Response {
  @PrimaryColumn()
  @Index()
  responseId: string;

  @ManyToOne(() => Survey, (survey) => survey.responses)
  @JoinColumn({
    name: 'surveyId',
  })
  survey: Survey;

  @ManyToOne(() => Question, (question) => question)
  @JoinColumn({
    name: 'questionId',
  })
  question: Question;

  @Column('text')
  answer: string;

  @CreateDateColumn()
  createdAt: Date;

  @BeforeInsert()
  setQuestionId() {
    this.responseId = v4();
  }
}
