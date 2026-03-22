import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion {
  number: number;
  text: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  marks: number;
  answer?: string;
}

export interface ISection {
  title: string;
  instruction: string;
  questions: IQuestion[];
}

export interface IAnswerKeyEntry {
  sectionTitle: string;
  questionNumber: number;
  answer: string;
}

export interface IQuestionPaper {
  schoolName: string;
  subject: string;
  className: string;
  timeAllowed: string;
  maximumMarks: number;
  generalInstructions: string[];
  sections: ISection[];
  answerKey?: IAnswerKeyEntry[];
}

export interface IResult extends Document {
  assignmentId: mongoose.Types.ObjectId | string;
  paper: IQuestionPaper;
  jobId: string;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>(
  {
    number: { type: Number, required: true },
    text: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ['Easy', 'Moderate', 'Hard'],
      required: true,
    },
    marks: { type: Number, required: true },
    answer: { type: String },
  },
  { _id: false }
);

const SectionSchema = new Schema<ISection>(
  {
    title: { type: String, required: true },
    instruction: { type: String, required: true },
    questions: { type: [QuestionSchema], required: true },
  },
  { _id: false }
);

const AnswerKeyEntrySchema = new Schema<IAnswerKeyEntry>(
  {
    sectionTitle: { type: String, required: true },
    questionNumber: { type: Number, required: true },
    answer: { type: String, required: true },
  },
  { _id: false }
);

const QuestionPaperSchema = new Schema<IQuestionPaper>(
  {
    schoolName: { type: String, required: true },
    subject: { type: String, required: true },
    className: { type: String, required: true },
    timeAllowed: { type: String, required: true },
    maximumMarks: { type: Number, required: true },
    generalInstructions: { type: [String], default: [] },
    sections: { type: [SectionSchema], required: true },
    answerKey: { type: [AnswerKeyEntrySchema], default: [] },
  },
  { _id: false }
);

const ResultSchema = new Schema<IResult>(
  {
    assignmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Assignment',
      required: true,
    },
    paper: { type: QuestionPaperSchema, required: true },
    jobId: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: any) => {
        ret._id = ret._id.toString();
        ret.assignmentId = ret.assignmentId.toString();
        return ret;
      },
    },
  }
);

ResultSchema.index({ assignmentId: 1 });

export const Result = mongoose.model<IResult>('Result', ResultSchema);