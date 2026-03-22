import { Router, Request, Response } from 'express';
import { z } from 'zod';
import mongoose from 'mongoose';
import { Assignment } from '../models/Assignment';
import { Result } from '../models/Result';
import { assessmentQueue } from '../services/queue';
import { cacheGet, cacheSet, cacheDel, redis } from '../config/redis';
import type { AssessmentJobData, AssessmentJobName } from '../services/queue';

const router = Router();

const QuestionTypeSchema = z.object({
  id: z.string(),
  type: z.string().min(1),
  count: z.number().int().min(1),
  marksEach: z.number().int().min(1),
});

const CreateAssignmentSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  subject: z.string().optional(),
  className: z.string().optional(),
  dueDate: z.string().min(1, 'Due date is required'),
  questionTypes: z.array(QuestionTypeSchema).min(1, 'At least one question type required'),
  additionalInstructions: z.string().optional(),
  fileUrl: z.string().url().optional().or(z.literal('')),
  fileName: z.string().optional(),
});
type CreateAssignmentDto = z.infer<typeof CreateAssignmentSchema>;
type IdParam = { id: string };

router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.headers['x-user-id'] as string || 'anonymous';
    const cacheKey = `assignments:all:${userId}`;

    const cached = await cacheGet<unknown[]>(cacheKey);
    if (cached) {
      return res.json({ success: true, data: cached });
    }

    const assignments = await Assignment.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    await cacheSet(cacheKey, assignments, 60);
    return res.json({ success: true, data: assignments });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to fetch assignments' });
  }
});

router.get('/:id', async (req: Request<IdParam>, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, error: 'Invalid ID' });
    }

    const userId = req.headers['x-user-id'] as string || 'anonymous';
    const assignment = await Assignment.findOne({ _id: req.params.id, userId }).lean();
    if (!assignment) {
      return res.status(404).json({ success: false, error: 'Assignment not found' });
    }

    return res.json({ success: true, data: assignment });
  } catch {
    return res.status(500).json({ success: false, error: 'Failed to fetch assignment' });
  }
});

router.post('/', async (req: Request<unknown, unknown, CreateAssignmentDto>, res: Response) => {
  try {
    const parsed = CreateAssignmentSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: parsed.error.errors.map((e) => e.message).join(', '),
      });
    }

    const data = parsed.data;

    const userId = req.headers['x-user-id'] as string || 'anonymous';

    const assignment = await Assignment.create({
      ...data,
      dueDate: new Date(data.dueDate),
      status: 'pending',
      userId,
    });

    const jobData: AssessmentJobData = {
      assignmentId: assignment._id.toString(),
      title: data.title,
      subject: data.subject,
      className: data.className,
      questionTypes: data.questionTypes,
      additionalInstructions: data.additionalInstructions,
      fileUrl: data.fileUrl,
      fileName: data.fileName,
    };

    const jobName: AssessmentJobName = 'generate-assessment';
    const job = await assessmentQueue.add(jobName, jobData, {
      jobId: `assessment-${assignment._id}`,
    });

    await redis.set(
      `assignment_job:${assignment._id}`,
      job.id!,
      'EX',
      86400
    );

    await cacheDel(`assignments:all:${userId}`);

    return res.status(201).json({
      success: true,
      data: {
        assignment: assignment.toJSON(),
        jobId: job.id,
      },
    });
  } catch (err) {
    console.error('Create assignment error:', err);
    return res.status(500).json({ success: false, error: 'Failed to create assignment' });
  }
});

router.post('/:id/regenerate', async (req: Request<IdParam>, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, error: 'Invalid ID' });
    }

    const userId = req.headers['x-user-id'] as string || 'anonymous';
    const assignment = await Assignment.findOne({ _id: req.params.id, userId });
    if (!assignment) {
      return res.status(404).json({ success: false, error: 'Assignment not found' });
    }

    assignment.status = 'pending';
    assignment.resultId = undefined;
    await assignment.save();

    if (assignment.resultId) {
      await Result.findByIdAndDelete(assignment.resultId);
    }

    const jobData: AssessmentJobData = {
      assignmentId: assignment._id.toString(),
      title: assignment.title,
      subject: assignment.subject,
      className: assignment.className,
      questionTypes: assignment.questionTypes,
      additionalInstructions: assignment.additionalInstructions,
    };

    const jobName: AssessmentJobName = 'generate-assessment';
    const job = await assessmentQueue.add(
      jobName,
      jobData,
      { jobId: `assessment-regen-${assignment._id}-${Date.now()}` }
    );

    await redis.set(
      `assignment_job:${assignment._id}`,
      job.id!,
      'EX',
      86400
    );

    await cacheDel(`assignments:all:${userId}`);

    return res.json({ success: true, data: { jobId: job.id } });
  } catch {
    return res.status(500).json({ success: false, error: 'Failed to regenerate' });
  }
});

router.delete('/:id', async (req: Request<IdParam>, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, error: 'Invalid ID' });
    }

    const userId = req.headers['x-user-id'] as string || 'anonymous';
    const assignment = await Assignment.findOneAndDelete({ _id: req.params.id, userId });
    if (!assignment) {
      return res.status(404).json({ success: false, error: 'Assignment not found' });
    }

    if (assignment.resultId) {
      await Result.findByIdAndDelete(assignment.resultId);
    }

    await cacheDel(`assignments:all:${userId}`);

    return res.json({ success: true, message: 'Assignment deleted' });
  } catch {
    return res.status(500).json({ success: false, error: 'Failed to delete' });
  }
});

export default router;