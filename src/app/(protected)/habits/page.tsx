'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { HabitModal } from '@/components/modals/habit-modal';
import { Habit } from '@/lib/types';
import { useUserData } from '@/components/data-context';

function HabitsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const { habits, refreshAll } = useUserData();

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
        refreshAll();
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
        refreshAll();
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
        refreshAll();
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
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Habits</h1>
          <p className="text-sm text-muted-foreground">
            Track and maintain your daily, weekly, and monthly habits
          </p>
        </div>
        <Button
          size="sm"
          className="px-3"
          onClick={() => {
            setSelectedHabit(null);
            setIsModalOpen(true);
          }}>
          <Plus className="w-4 h-4 mr-2" />
          New Habit
        </Button>
      </div>
      {habits.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <Plus className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No habits yet</h3>
          <p className="text-sm text-muted-foreground text-center max-w-sm mb-6">
            Create your first habit to start building consistent routines and
            tracking your progress.
          </p>
          <Button
            size="sm"
            onClick={() => {
              setSelectedHabit(null);
              setIsModalOpen(true);
            }}>
            Create your first habit
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {habits.map((habit) => (
            <Card key={habit.id} className="group">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span className="truncate mr-2">{habit.name}</span>
                  <span className="text-sm font-normal flex items-center gap-1.5 shrink-0 bg-orange-500/10 text-orange-600 dark:text-orange-400 px-2.5 py-0.5 rounded-full">
                    <span className="text-base">🔥</span>
                    <span>
                      {habit.streak} day{habit.streak !== 1 ? 's' : ''}
                    </span>
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        habit.frequency === 'DAILY'
                          ? 'bg-green-500'
                          : habit.frequency === 'WEEKLY'
                          ? 'bg-blue-500'
                          : 'bg-purple-500'
                      }`}
                    />
                    <span className="text-sm text-muted-foreground">
                      {habit.frequency.toLowerCase()}
                    </span>
                  </div>
                  {getTimeUntilAvailable(habit) && (
                    <span className="text-sm text-muted-foreground/90">
                      {getTimeUntilAvailable(habit)}
                    </span>
                  )}
                </div>
                {habit.goal && (
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-orange-500" />
                    <span className="text-sm text-muted-foreground truncate">
                      {habit.goal.name}
                    </span>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedHabit(habit);
                    setIsModalOpen(true);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity">
                  Edit
                </Button>
                {shouldComplete(habit) ? (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleIncrementStreak(habit)}
                    className="w-32">
                    Complete
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled
                    className="w-32">
                    Completed
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

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
