"use client";

import { useEffect, useRef } from 'react';
import { useAuthStore, useNotificationsStore } from '@/store';
import { toast } from 'sonner';
import { io, Socket } from 'socket.io-client';

export function useNotificationsSocket() {
  const { token, isAuthenticated } = useAuthStore();
  const { fetchNotifications } = useNotificationsStore();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) return;

    const socket = io(apiUrl, {
      auth: {
        token: token
      }
    });
    
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Notification Socket.io connected');
    });

    // Listen for the 'announcement' event as per backend requirements
    socket.on('announcement', (data: { title: string; message: string }) => {
      console.log('New Announcement Received:', data.title);
      
      // Display toast notification
      toast.info(data.title, {
        description: data.message,
        duration: 8000,
      });

      fetchNotifications();
    });

    socket.on('connect_error', (error) => {
      console.error('Socket.io Connection Error ❌:', error);
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket.io Disconnected:', reason);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [token, isAuthenticated, fetchNotifications]);

  return null;
}
