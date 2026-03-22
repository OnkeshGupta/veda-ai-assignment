import { Queue } from 'bullmq';
import { config } from '../config';
import type { IQuestionTypeEntry } from '../models/Assignment';

export type AssessmentJobName = 'generate-assessment';

export interface AssessmentJobData {
  assignmentId: string;
  title: string;
  subject?: string;
  className?: string;
  questionTypes: IQuestionTypeEntry[];
  additionalInstructions?: string;
  fileUrl?: string;
  fileName?: string;
}

export const assessmentQueue = new Queue<AssessmentJobData, any, AssessmentJobName>(
  config.queues.assessment,
  {
    connection: {
      url: config.redisUrl,
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      keepAlive: 10000,
      tls: config.redisUrl.startsWith('rediss://') ? { rejectUnauthorized: false } : undefined,
    },
  }
);