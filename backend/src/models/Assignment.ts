import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestionTypeEntry {
  id: string;
  type: string;
  count: number;
  marksEach: number;
}

export interface IAssignment extends Document {
  title: string;
  subject?: string;
  className?: string;
  dueDate: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  questionTypes: IQuestionTypeEntry[];
  additionalInstructions?: string;
  fileUrl?: string;
  fileName?: string;
  resultId?: mongoose.Types.ObjectId | string;
  jobId?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionTypeEntrySchema = new Schema<IQuestionTypeEntry>(
  {
    id: { type: String, required: true },
    type: { type: String, required: true },
    count: { type: Number, required: true, min: 1 },
    marksEach: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const AssignmentSchema = new Schema<IAssignment>(
  {
    title: { type: String, required: true, trim: true },
    subject: { type: String, trim: true },
    className: { type: String, trim: true },
    dueDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    questionTypes: {
      type: [QuestionTypeEntrySchema],
      required: true,
      validate: {
        validator: (v: IQuestionTypeEntry[]) => v.length > 0,
        message: 'At least one question type is required',
      },
    },
    additionalInstructions: { type: String, trim: true },
    fileUrl: { type: String },
    fileName: { type: String },
    resultId: { type: Schema.Types.ObjectId, ref: 'Result' },
    jobId: { type: String },
    userId: { type: String, required: true, index: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: any) => {
        ret._id = ret._id.toString();
        if (ret.resultId) ret.resultId = ret.resultId.toString();
        return ret;
      },
    },
  }
);

AssignmentSchema.index({ createdAt: -1 });
AssignmentSchema.index({ status: 1 });

export const Assignment = mongoose.model<IAssignment>('Assignment', AssignmentSchema);