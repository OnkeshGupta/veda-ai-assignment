'use client';

import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { WS_URL } from '@/lib/utils';
import type { JobProgressEvent } from '@/types';

let globalSocket: Socket | null = null;

function getSocket(): Socket | null {
  if (typeof window === 'undefined') return null;

  if (!globalSocket) {
    globalSocket = io(WS_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    globalSocket.on('connect', () => {
      console.log('[Socket] Connected:', globalSocket?.id);
    });

    globalSocket.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected:', reason);
    });

    globalSocket.on('connect_error', (err) => {
      console.warn('[Socket] Connection error:', err.message);
    });
  }

  if (!globalSocket?.connected) {
    // Only connect if totally disconnected and we aren't in the middle of connecting
    globalSocket?.connect();
  }

  return globalSocket;
}

export function useSocketJob() {
  const callbackRef = useRef<((event: JobProgressEvent) => void) | null>(null);

  function listenToJob(
    assignmentId: string,
    _jobId: string,
    onProgress: (event: JobProgressEvent) => void
  ) {
    callbackRef.current = onProgress;

    const socket = getSocket();
    if (!socket) return;

    socket.emit('join:assignment', assignmentId);

    const handler = (event: JobProgressEvent) => {
      if (event.assignmentId === assignmentId && callbackRef.current) {
        callbackRef.current(event);
      }
    };

    socket.on('job:progress', handler);
  }

  function stopListening(assignmentId: string) {
    const socket = getSocket();
    if (!socket) return;

    socket.emit('leave:assignment', assignmentId);
    socket.off('job:progress');
  }

  return { listenToJob, stopListening };
}

export function useAssignmentSocket(
  assignmentId: string | null,
  onProgress: (event: JobProgressEvent) => void
) {
  const callbackRef = useRef(onProgress);
  callbackRef.current = onProgress;

  useEffect(() => {
    if (!assignmentId) return;

    const socket = getSocket();
    if (!socket) return; // SSR safety

    socket.emit('join:assignment', assignmentId);

    function handleProgress(event: JobProgressEvent) {
      if (event.assignmentId === assignmentId) {
        callbackRef.current(event);
      }
    }

    socket.on('job:progress', handleProgress);

    return () => {
      socket.off('job:progress', handleProgress);
      socket.emit('leave:assignment', assignmentId);
    };
  }, [assignmentId]);
}