import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const QUEUE_KEY = 'transfer_queue';

export interface QueuedTransfer {
  id: string;
  payload: any;
  timestamp: number;
  status: 'pending' | 'failed';
}

export function useQueuedTransfers() {
  const [queue, setQueue] = useState<QueuedTransfer[]>([]);

  useEffect(() => {
    loadQueue();
  }, []);

  const loadQueue = async () => {
    const stored = await AsyncStorage.getItem(QUEUE_KEY);
    if (stored) {
      setQueue(JSON.parse(stored));
    }
  };

  const addToQueue = async (transfer: any) => {
    const newItem: QueuedTransfer = {
      id: Math.random().toString(36).substr(2, 9),
      payload: transfer,
      timestamp: Date.now(),
      status: 'pending',
    };
    const newQueue = [...queue, newItem];
    setQueue(newQueue);
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(newQueue));
  };

  const removeFromQueue = async (id: string) => {
    const newQueue = queue.filter(item => item.id !== id);
    setQueue(newQueue);
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(newQueue));
  };

  return { queue, addToQueue, removeFromQueue };
}
