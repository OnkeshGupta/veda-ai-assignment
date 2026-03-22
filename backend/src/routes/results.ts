import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { Result } from '../models/Result';
import { cacheGet, cacheSet } from '../config/redis';

const router = Router();

type IdParam = { id: string };
type AssignmentIdParam = { assignmentId: string };

router.get('/:id', async (req: Request<IdParam>, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, error: 'Invalid ID' });
    }

    const cacheKey = `result:${req.params.id}`;
    const cached = await cacheGet(cacheKey);
    if (cached) {
      return res.json({ success: true, data: cached });
    }

    const result = await Result.findById(req.params.id).lean();
    if (!result) {
      return res.status(404).json({ success: false, error: 'Result not found' });
    }

    await cacheSet(cacheKey, result, 3600);

    return res.json({ success: true, data: result });
  } catch {
    return res.status(500).json({ success: false, error: 'Failed to fetch result' });
  }
});

router.get('/by-assignment/:assignmentId', async (req: Request<AssignmentIdParam>, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.assignmentId)) {
      return res.status(400).json({ success: false, error: 'Invalid ID' });
    }

    const result = await Result.findOne({
      assignmentId: req.params.assignmentId,
    })
      .sort({ createdAt: -1 })
      .lean();

    if (!result) {
      return res.status(404).json({ success: false, error: 'Result not found' });
    }

    return res.json({ success: true, data: result });
  } catch {
    return res.status(500).json({ success: false, error: 'Failed to fetch result' });
  }
});

export default router;