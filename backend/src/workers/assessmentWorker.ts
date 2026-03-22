import { Worker, Job } from 'bullmq';
import { config } from '../config';
import { connectMongoDB } from '../config/database';
import { Assignment } from '../models/Assignment';
import { Result } from '../models/Result';
import { generateQuestionPaper } from '../services/aiService';
import { setJobState } from '../config/redis';
import type { AssessmentJobData } from '../services/queue';
import Redis from 'ioredis';

const redisPub = new Redis(config.redisUrl, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  keepAlive: 10000,
  tls: config.redisUrl.startsWith('rediss://') ? { rejectUnauthorized: false } : undefined,
});

redisPub.on('connect', () => console.log('✅ Redis pub connected'));
redisPub.on('error', (err) => console.error('❌ Redis pub error:', err));

async function publishProgress(event: Record<string, unknown>): Promise<void> {
  try {
    await redisPub.publish('job:progress', JSON.stringify(event));
  } catch (err) {
    console.error('[Worker] Failed to publish progress event:', err);
  }
}

async function reportProgress(
  job: Job<AssessmentJobData>,
  status: string,
  progress: number,
  message: string,
  extra?: Record<string, unknown>
): Promise<void> {
  await job.updateProgress(progress);

  const event = {
    jobId: job.id,
    assignmentId: job.data.assignmentId,
    status,
    progress,
    message,
    ...extra,
  };

  await setJobState(job.id!, event);

  await publishProgress(event);

  console.log(`[Worker] Job ${job.id} | ${status} (${progress}%) — ${message}`);
}

const worker = new Worker<AssessmentJobData>(
  config.queues.assessment,
  async (job) => {
    const {
      assignmentId, title, subject,
      className, questionTypes, additionalInstructions,
    } = job.data;

    await reportProgress(job, 'processing', 10, 'Starting generation...');

    await Assignment.findByIdAndUpdate(assignmentId, {
      status: 'processing',
      jobId: job.id,
    });

    await reportProgress(job, 'generating', 30, 'Generating questions with AI...');

    const paper = await generateQuestionPaper({
      title,
      subject,
      className,
      questionTypes,
      additionalInstructions,
    });

    await reportProgress(job, 'structuring', 70, 'Structuring question paper...');

    const result = await Result.create({
      assignmentId,
      paper,
      jobId: job.id,
    });

    await reportProgress(job, 'saving', 90, 'Saving to database...');

    await Assignment.findByIdAndUpdate(assignmentId, {
      status: 'completed',
      resultId: result._id,
    });

    await reportProgress(job, 'completed', 100, 'Question paper ready!', {
      resultId: result._id.toString(),
    });

    return { resultId: result._id.toString() };
  },
  {
    connection: {
      url: config.redisUrl,
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      keepAlive: 10000,
      tls: config.redisUrl.startsWith('rediss://') ? { rejectUnauthorized: false } : undefined,
    },
    concurrency: 2,
  }
);

worker.on('failed', async (job, err) => {
  console.error(`❌ Job ${job?.id} failed:`, err.message);

  if (job) {
    const event = {
      jobId: job.id,
      assignmentId: job.data.assignmentId,
      status: 'failed',
      progress: 0,
      message: 'Generation failed. Please try again.',
      error: err.message,
    };

    await setJobState(job.id!, event);

    await publishProgress(event);

    await Assignment.findByIdAndUpdate(job.data.assignmentId, {
      status: 'failed',
    }).catch(() => { });
  }
});

worker.on('completed', (job) => {
  console.log(`✅ Job ${job.id} completed`);
});

worker.on('error', (err) => {
  console.error('❌ Worker error:', err);
});

async function startWorker() {
  await connectMongoDB();
  console.log('🚀 Assessment worker started');
}

startWorker().catch(console.error);

export default worker;