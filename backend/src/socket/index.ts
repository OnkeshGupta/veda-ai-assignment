import { Server as HttpServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { config } from '../config';
import { getJobState, redisSub } from '../config/redis';

let io: SocketServer | null = null;

export function initSocketServer(httpServer: HttpServer): SocketServer {
  io = new SocketServer(httpServer, {
    cors: {
      origin: config.frontendUrl,
      methods: ['GET', 'POST'],
    },
    transports: ['websocket', 'polling'],
  });

  io.on('connection', (socket) => {
    console.log(`🔌 WS client connected: ${socket.id}`);

    socket.on('join:assignment', async (assignmentId: string) => {
      const room = `assignment:${assignmentId}`;
      socket.join(room);
      console.log(`   ↳ joined room: ${room}`);

      const latestJobKey = `assignment_job:${assignmentId}`;
      const jobId = await getJobState<string>(latestJobKey);
      if (jobId) {
        const state = await getJobState(`job:${jobId}`);
        if (state) {
          socket.emit('job:progress', state);
        }
      }
    });

    socket.on('leave:assignment', (assignmentId: string) => {
      socket.leave(`assignment:${assignmentId}`);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 WS client disconnected: ${socket.id}`);
    });
  });

  redisSub.subscribe('job:progress', (err) => {
    if (err) {
      console.error('❌ Failed to subscribe to Redis job:progress channel:', err);
    } else {
      console.log('✅ Subscribed to Redis job:progress channel');
    }
  });

  redisSub.on('message', (channel, message) => {
    if (channel !== 'job:progress') return;

    try {
      const event = JSON.parse(message) as {
        jobId: string;
        assignmentId: string;
        status: string;
        progress: number;
        message: string;
        resultId?: string;
        error?: string;
      };

      if (!io || !event.assignmentId) return;

      io.to(`assignment:${event.assignmentId}`).emit('job:progress', event);

      console.log(
        `[Socket] Forwarded job:progress → room assignment:${event.assignmentId}` +
        ` | status: ${event.status} (${event.progress}%)`
      );
    } catch (err) {
      console.error('[Socket] Failed to parse Redis message:', err);
    }
  });

  return io;
}

export function getSocketServer(): SocketServer | null {
  return io;
}