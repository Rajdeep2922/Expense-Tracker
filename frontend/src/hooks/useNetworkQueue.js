// src/hooks/useNetworkQueue.js
import { useEffect, useRef } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { useAuth } from '../context/AuthContext';

const QUEUE_KEY = 'offline_mutation_queue';

export function useNetworkQueue() {
  const { createExpense, updateExpense, deleteExpense } = useExpenses();
  const { user } = useAuth();
  const drainingRef = useRef(false);

  useEffect(() => {
    const drainQueue = async () => {
      if (drainingRef.current || !navigator.onLine || !user) return;
      
      const stored = localStorage.getItem(QUEUE_KEY);
      if (!stored) return;

      let queue = [];
      try { queue = JSON.parse(stored); } catch { return; }
      if (!queue.length) return;

      drainingRef.current = true;
      const failed = [];

      for (const item of queue) {
        try {
          if (item.type === 'CREATE_EXPENSE') await createExpense(item.payload);
          if (item.type === 'UPDATE_EXPENSE') await updateExpense(item.payload.id, item.payload.data);
          if (item.type === 'DELETE_EXPENSE') await deleteExpense(item.payload.id);
        } catch (err) {
          console.error('Failed to sync offline item', item, err);
          failed.push(item);
        }
      }

      if (failed.length > 0) {
        localStorage.setItem(QUEUE_KEY, JSON.stringify(failed));
      } else {
        localStorage.removeItem(QUEUE_KEY);
      }
      drainingRef.current = false;
    };

    window.addEventListener('online', drainQueue);
    // Attempt drain on mount if online
    if (navigator.onLine) {
      drainQueue();
    }

    return () => window.removeEventListener('online', drainQueue);
  }, [user, createExpense, updateExpense, deleteExpense]);

  const queueMutation = (type, payload) => {
    const stored = localStorage.getItem(QUEUE_KEY);
    const queue = stored ? JSON.parse(stored) : [];
    queue.push({ type, payload, timestamp: Date.now() });
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  };

  const isOnline = navigator.onLine;

  return { queueMutation, isOnline };
}
