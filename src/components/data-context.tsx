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
  createTask: (task: Omit<Task, 'id'>) => Promise<Task>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  createHabit: (habit: Omit<Habit, 'id'>) => Promise<Habit>;
  updateHabit: (habitId: string, updates: Partial<Habit>) => Promise<void>;
  deleteHabit: (habitId: string) => Promise<void>;
  createGoal: (name: string, description: string) => Promise<Goal>;
  updateGoal: (goalId: string, updates: Partial<Goal>) => Promise<void>;
  deleteGoal: (goalId: string) => Promise<void>;
  createNote: (note: Omit<Note, 'id'>) => Promise<Note>;
  updateNote: (noteId: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (noteId: string) => Promise<void>;
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
  createTask: async () => null as unknown as Task,
  updateTask: async () => {},
  deleteTask: async () => {},
  // Habit operations
  createHabit: async () => null as unknown as Habit,
  updateHabit: async () => {},
  deleteHabit: async () => {},
  // Goal operations
  createGoal: async () => null as unknown as Goal,
  updateGoal: async () => {},
  deleteGoal: async () => {},
  // Note operations
  createNote: async () => null as unknown as Note,
  updateNote: async () => {},
  deleteNote: async () => {},
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

  const updateTask = useCallback(
    async (taskId: string, updates: Partial<Task>) => {
      const taskIndex = tasks.findIndex((t) => t.id === taskId);
      if (taskIndex === -1) return;

      const previousTask = tasks[taskIndex];
      // Optimistically update local state
      setTasks((prev) => {
        const next = [...prev];
        next[taskIndex] = { ...previousTask, ...updates };
        return next;
      });

      try {
        const res = await fetch(`/api/tasks/${taskId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...previousTask, ...updates }),
        });
        if (!res.ok) throw new Error('Failed to update task');

        const data = await res.json();
        // Update with server response
        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  ...data,
                  start: new Date(data.start),
                  end: new Date(data.end),
                }
              : t
          )
        );
      } catch (err) {
        console.error('Failed to update task:', err);
        setError('Failed to update task');
        // Rollback to previous state
        setTasks((prev) => {
          const next = [...prev];
          next[taskIndex] = previousTask;
          return next;
        });
      }
    },
    [tasks]
  );

  const updateHabit = useCallback(
    async (habitId: string, updates: Partial<Habit>) => {
      const habitIndex = habits.findIndex((h) => h.id === habitId);
      if (habitIndex === -1) return;

      const previousHabit = habits[habitIndex];
      // Optimistically update local state
      setHabits((prev) => {
        const next = [...prev];
        next[habitIndex] = { ...previousHabit, ...updates };
        return next;
      });

      try {
        const res = await fetch(`/api/habits/${habitId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...previousHabit, ...updates }),
        });
        if (!res.ok) throw new Error('Failed to update habit');

        const data = await res.json();
        // Update with server response
        setHabits((prev) =>
          prev.map((h) =>
            h.id === habitId
              ? {
                  ...h,
                  ...data,
                }
              : h
          )
        );
      } catch (err) {
        console.error('Failed to update habit:', err);
        setError('Failed to update habit');
        // Rollback to previous state
        setHabits((prev) => {
          const next = [...prev];
          next[habitIndex] = previousHabit;
          return next;
        });
      }
    },
    [habits]
  );

  const updateGoal = useCallback(
    async (goalId: string, updates: Partial<Goal>) => {
      const goalIndex = goals.findIndex((g) => g.id === goalId);
      if (goalIndex === -1) return;

      const previousGoal = goals[goalIndex];
      // Optimistically update local state
      setGoals((prev) => {
        const next = [...prev];
        next[goalIndex] = { ...previousGoal, ...updates };
        return next;
      });

      try {
        const res = await fetch(`/api/goals/${goalId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...previousGoal, ...updates }),
        });
        if (!res.ok) throw new Error('Failed to update goal');

        const data = await res.json();
        // Update with server response
        setGoals((prev) =>
          prev.map((g) => (g.id === goalId ? { ...g, ...data } : g))
        );
      } catch (err) {
        console.error('Failed to update goal:', err);
        setError('Failed to update goal');
        // Rollback to previous state
        setGoals((prev) => {
          const next = [...prev];
          next[goalIndex] = previousGoal;
          return next;
        });
      }
    },
    [goals]
  );

  const updateNote = useCallback(
    async (noteId: string, updates: Partial<Note>) => {
      const noteIndex = notes.findIndex((n) => n.id === noteId);
      if (noteIndex === -1) return;

      const previousNote = notes[noteIndex];
      // Optimistically update local state
      setNotes((prev) => {
        const next = [...prev];
        next[noteIndex] = { ...previousNote, ...updates };
        return next;
      });

      try {
        const res = await fetch(`/api/notes/${noteId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...previousNote, ...updates }),
        });
        if (!res.ok) throw new Error('Failed to update note');

        const data = await res.json();
        // Update with server response
        setNotes((prev) =>
          prev.map((n) => (n.id === noteId ? { ...n, ...data } : n))
        );
      } catch (err) {
        console.error('Failed to update note:', err);
        setError('Failed to update note');
        // Rollback to previous state
        setNotes((prev) => {
          const next = [...prev];
          next[noteIndex] = previousNote;
          return next;
        });
      }
    },
    [notes]
  );

  // Task CRUD operations
  const createTask = useCallback(async (taskData: Omit<Task, 'id'>) => {
    const tempId = `temp-${Date.now()}`;
    const optimisticTask = { ...taskData, id: tempId } as Task;

    setTasks((prev) => [...prev, optimisticTask]);

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });
      if (!res.ok) throw new Error('Failed to create task');

      const newTask = await res.json();
      setTasks((prev) =>
        prev.map((t) =>
          t.id === tempId
            ? {
                ...newTask,
                start: new Date(newTask.start),
                end: new Date(newTask.end),
              }
            : t
        )
      );
      return newTask;
    } catch (err) {
      console.error('Failed to create task:', err);
      setError('Failed to create task');
      setTasks((prev) => prev.filter((t) => t.id !== tempId));
      throw err;
    }
  }, []);

  const deleteTask = useCallback(
    async (taskId: string) => {
      const taskToDelete = tasks.find((t) => t.id === taskId);
      if (!taskToDelete) return;

      setTasks((prev) => prev.filter((t) => t.id !== taskId));

      try {
        const res = await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete task');
      } catch (err) {
        console.error('Failed to delete task:', err);
        setError('Failed to delete task');
        setTasks((prev) => [...prev, taskToDelete]);
        throw err;
      }
    },
    [tasks]
  );

  // Habit CRUD operations
  const createHabit = useCallback(async (habitData: Omit<Habit, 'id'>) => {
    const tempId = `temp-${Date.now()}`;
    const optimisticHabit = { ...habitData, id: tempId } as Habit;

    setHabits((prev) => [...prev, optimisticHabit]);

    try {
      const res = await fetch('/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(habitData),
      });
      if (!res.ok) throw new Error('Failed to create habit');

      const newHabit = await res.json();
      setHabits((prev) =>
        prev.map((h) =>
          h.id === tempId
            ? {
                ...newHabit,
              }
            : h
        )
      );
      return newHabit;
    } catch (err) {
      console.error('Failed to create habit:', err);
      setError('Failed to create habit');
      setHabits((prev) => prev.filter((h) => h.id !== tempId));
      throw err;
    }
  }, []);

  const deleteHabit = useCallback(
    async (habitId: string) => {
      const habitToDelete = habits.find((h) => h.id === habitId);
      if (!habitToDelete) return;

      setHabits((prev) => prev.filter((h) => h.id !== habitId));

      try {
        const res = await fetch(`/api/habits/${habitId}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete habit');
      } catch (err) {
        console.error('Failed to delete habit:', err);
        setError('Failed to delete habit');
        setHabits((prev) => [...prev, habitToDelete]);
        throw err;
      }
    },
    [habits]
  );

  // Goal CRUD operations
  const createGoal = useCallback(async (name: string, description: string) => {
    const tempId = `temp-${Date.now()}`;
    const optimisticGoal = { id: tempId, name, description } as Goal;

    setGoals((prev) => [...prev, optimisticGoal]);

    try {
      const res = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      });
      if (!res.ok) throw new Error('Failed to create goal');

      const newGoal = await res.json();
      setGoals((prev) => prev.map((g) => (g.id === tempId ? newGoal : g)));
      return newGoal;
    } catch (err) {
      console.error('Failed to create goal:', err);
      setError('Failed to create goal');
      setGoals((prev) => prev.filter((g) => g.id !== tempId));
      throw err;
    }
  }, []);

  const deleteGoal = useCallback(
    async (goalId: string) => {
      const goalToDelete = goals.find((g) => g.id === goalId);
      if (!goalToDelete) return;

      setGoals((prev) => prev.filter((g) => g.id !== goalId));

      try {
        const res = await fetch(`/api/goals/${goalId}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete goal');
      } catch (err) {
        console.error('Failed to delete goal:', err);
        setError('Failed to delete goal');
        setGoals((prev) => [...prev, goalToDelete]);
        throw err;
      }
    },
    [goals]
  );

  // Note CRUD operations
  const createNote = useCallback(async (noteData: Omit<Note, 'id'>) => {
    const tempId = `temp-${Date.now()}`;
    const optimisticNote = { ...noteData, id: tempId } as Note;

    setNotes((prev) => [...prev, optimisticNote]);

    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noteData),
      });
      if (!res.ok) throw new Error('Failed to create note');

      const newNote = await res.json();
      setNotes((prev) => prev.map((n) => (n.id === tempId ? newNote : n)));
      return newNote;
    } catch (err) {
      console.error('Failed to create note:', err);
      setError('Failed to create note');
      setNotes((prev) => prev.filter((n) => n.id !== tempId));
      throw err;
    }
  }, []);

  const deleteNote = useCallback(
    async (noteId: string) => {
      const noteToDelete = notes.find((n) => n.id === noteId);
      if (!noteToDelete) return;

      setNotes((prev) => prev.filter((n) => n.id !== noteId));

      try {
        const res = await fetch(`/api/notes/${noteId}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete note');
      } catch (err) {
        console.error('Failed to delete note:', err);
        setError('Failed to delete note');
        setNotes((prev) => [...prev, noteToDelete]);
        throw err;
      }
    },
    [notes]
  );

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
        createTask,
        updateTask,
        deleteTask,
        createHabit,
        updateHabit,
        deleteHabit,
        createGoal,
        updateGoal,
        deleteGoal,
        createNote,
        updateNote,
        deleteNote,
      }}>
      {children}
    </DataContext.Provider>
  );
};

export const useUserData = () => useContext(DataContext);
