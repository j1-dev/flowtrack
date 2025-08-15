'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import type { User, Task, Habit, Goal, Note } from '@/lib/types';

type DataContextType = {
  user: User | null;
  tasks: Task[];
  habits: Habit[];
  goals: Goal[];
  notes: Note[];
  loading: boolean;
  error: string | null;
  refreshAll: () => Promise<void>;
};

const DataContext = createContext<DataContextType>({
  user: null,
  tasks: [],
  habits: [],
  goals: [],
  notes: [],
  loading: true,
  error: null,
  refreshAll: async () => {},
});

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/user-data/`, {
        cache: 'no-store',
      });
      if (!res.ok) throw new Error('Failed to fetch user data');

      const { user, tasks, habits, goals, notes } = await res.json();

      setUser(user);
      setTasks(
        tasks.map((task: Task) => ({
          ...task,
          start: new Date(task.start),
          end: new Date(task.end),
        }))
      );
      setHabits(habits);
      setGoals(goals);
      setNotes(notes);
    } catch (err) {
      console.error(err);
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return (
    <DataContext.Provider
      value={{
        user,
        tasks,
        habits,
        goals,
        notes,
        loading,
        error,
        refreshAll: fetchAll,
      }}>
      {children}
    </DataContext.Provider>
  );
};

export const useUserData = () => useContext(DataContext);
