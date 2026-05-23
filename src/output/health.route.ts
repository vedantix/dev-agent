import { Router, Request, Response } from 'express';

type HealthResponse = {
  status: 'ok';
  uptime: number;
  timestamp: string;
};

const router = Router();

router.get('/health', (_req: Request, res: Response<HealthResponse>) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

router.head('/health', (_req: Request, res: Response) => {
  res.status(200).end();
});

export default router;