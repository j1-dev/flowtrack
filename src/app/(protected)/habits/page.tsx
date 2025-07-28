'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { HabitModal } from '@/components/habit-modal';
import { Habit } from '@/lib/types';

function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const response = await fetch('/api/habits');
      const data = await response.json();
      setHabits(data);
    } catch (error) {
      console.error('Error fetching habits:', error);
    }
  };

  const handleSave = async (habit: Habit) => {
    try {
      const url = habit.id ? `/api/habits/${habit.id}` : '/api/habits';
      const method = habit.id ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(habit),
      });
      if (response.ok) {
        fetchHabits();
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Error saving habit:', error);
    }
  };

  const handleDelete = async (habit: Habit) => {
    try {
      const response = await fetch(`/api/habits/${habit.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchHabits();
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  };

  const handleIncrementStreak = async (habit: Habit) => {
    try {
      const response = await fetch(`/api/habits/${habit.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...habit,
          streak: habit.streak + 1,
          completedAt: new Date(),
        }),
      });
      if (response.ok) {
        fetchHabits();
      }
    } catch (error) {
      console.error('Error updating habit streak:', error);
    }
  };

  const getTimeUntilAvailable = (habit: Habit): string | null => {
    if (habit.completedAt === habit.createdAt) {
      return null; // New habit, available immediately
    }

    const now = new Date();
    const updatedAt = new Date(habit.completedAt);
    let nextAvailable: Date;

    switch (habit.frequency) {
      case 'DAILY': {
        nextAvailable = new Date(updatedAt);
        nextAvailable.setDate(updatedAt.getDate() + 1);
        nextAvailable.setHours(updatedAt.getHours());
        nextAvailable.setMinutes(updatedAt.getMinutes());
        break;
      }
      case 'WEEKLY': {
        nextAvailable = new Date(updatedAt);
        nextAvailable.setDate(updatedAt.getDate() + 7);
        break;
      }
      case 'MONTHLY': {
        nextAvailable = new Date(updatedAt);
        nextAvailable.setMonth(updatedAt.getMonth() + 1);
        break;
      }
      default:
        return null;
    }

    if (now >= nextAvailable) {
      return null; // Already available
    }

    const diff = nextAvailable.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days} day${days !== 1 ? 's' : ''} remaining`;
    }
    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    }
    return `${minutes}m remaining`;
  };

  const shouldComplete = (habit: Habit) => {
    // If the habit has never been updated (new habit), it should be completable
    if (habit.completedAt === habit.createdAt) {
      return true;
    }

    const today = new Date();
    const updatedAt = new Date(habit.completedAt);

    switch (habit.frequency) {
      case 'DAILY':
        return today.toDateString() !== updatedAt.toDateString();
      case 'WEEKLY':
        const weekDiff = Math.floor(
          (today.getTime() - updatedAt.getTime()) / (1000 * 60 * 60 * 24 * 7)
        );
        return weekDiff >= 1;
      case 'MONTHLY':
        return (
          today.getMonth() !== updatedAt.getMonth() ||
          today.getFullYear() !== updatedAt.getFullYear()
        );
      default:
        return false;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Habits</h1>
        <Button
          onClick={() => {
            setSelectedHabit(null);
            setIsModalOpen(true);
          }}>
          Create New Habit
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {habits.map((habit) => (
          <Card key={habit.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{habit.name}</span>
                <span className="text-sm font-normal flex items-center gap-1">
                  <span className="text-orange-500">🔥</span>
                  <span>
                    {habit.streak} day{habit.streak !== 1 ? 's' : ''}
                  </span>
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="inline-flex relative w-full">
                <p className="text-sm text-muted-foreground absolute">
                  Frequency: {habit.frequency.toLowerCase()}
                </p>
                {getTimeUntilAvailable(habit) && (
                  <p className="text-sm text-muted-foreground/80 absolute right-0">
                    {getTimeUntilAvailable(habit)}
                  </p>
                )}
              </div>
              {habit.goal && (
                <p className="text-sm text-muted-foreground mt-1">
                  Goal: {habit.goal.name}
                </p>
              )}
            </CardContent>
            <CardFooter className="flex justify-between gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedHabit(habit);
                  setIsModalOpen(true);
                }}>
                Edit
              </Button>
              {shouldComplete(habit) ? (
                <Button
                  variant="default"
                  onClick={() => handleIncrementStreak(habit)}>
                  Complete Today
                </Button>
              ) : (
                <div className="flex flex-col items-end gap-1">
                  <Button variant="secondary" disabled>
                    Completed
                  </Button>
                </div>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      <HabitModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        onDelete={handleDelete}
        initialHabit={selectedHabit}
      />
    </div>
  );
}

export default HabitsPage;
