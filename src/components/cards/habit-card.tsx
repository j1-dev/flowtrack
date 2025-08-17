'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Habit } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';

interface HabitCardProps {
  habit: Habit;
  setSelectedHabit: (habit: Habit) => void;
  setIsModalOpen: (open: boolean) => void;
  handleIncrementStreak: (habit: Habit) => void;
}

export const HabitCard = ({
  habit,
  setSelectedHabit,
  setIsModalOpen,
  handleIncrementStreak,
}: HabitCardProps) => {
  const getTimeUntilAvailable = (habit: Habit): string | null => {
    if (habit.completedAt === habit.createdAt) return null;

    const now = new Date();
    const updatedAt = new Date(habit.completedAt);
    let nextAvailable: Date;

    switch (habit.frequency) {
      case 'DAILY':
        nextAvailable = new Date(updatedAt);
        nextAvailable.setDate(updatedAt.getDate() + 1);
        break;
      case 'WEEKLY':
        nextAvailable = new Date(updatedAt);
        nextAvailable.setDate(updatedAt.getDate() + 7);
        break;
      case 'MONTHLY':
        nextAvailable = new Date(updatedAt);
        nextAvailable.setMonth(updatedAt.getMonth() + 1);
        break;
      default:
        return null;
    }

    if (now >= nextAvailable) return null;

    const diff = nextAvailable.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days} day${days !== 1 ? 's' : ''} remaining`;
    }
    if (hours > 0) return `${hours}h ${minutes}m remaining`;
    return `${minutes}m remaining`;
  };

  const shouldComplete = (habit: Habit) => {
    if (habit.completedAt === habit.createdAt) return true;

    const today = new Date();
    const updatedAt = new Date(habit.completedAt);

    switch (habit.frequency) {
      case 'DAILY':
        return today.toDateString() !== updatedAt.toDateString();
      case 'WEEKLY':
        return (
          (today.getTime() - updatedAt.getTime()) / (1000 * 60 * 60 * 24 * 7) >=
          1
        );
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
    <Card className="group transition-all">
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="truncate">{habit.name}</CardTitle>
        <span className="text-sm font-normal flex items-center gap-1.5 shrink-0 bg-orange-500/10 text-orange-600 dark:text-orange-400 px-2.5 py-0.5 rounded-full">
          <span className="text-base">🔥</span>
          <span>
            {habit.streak} day{habit.streak !== 1 ? 's' : ''}
          </span>
        </span>
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

      <CardFooter className="flex justify-end gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setSelectedHabit(habit);
            setIsModalOpen(true);
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity">
          <Pencil className="w-4 h-4" />
        </Button>
        {shouldComplete(habit) ? (
          <Button
            variant="default"
            size="sm"
            onClick={() => handleIncrementStreak(habit)}>
            Complete
          </Button>
        ) : (
          <Button variant="secondary" size="sm" disabled>
            Completed
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
