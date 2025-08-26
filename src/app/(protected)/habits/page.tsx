'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HabitModal } from '@/components/modals/habit-modal';
import { Habit } from '@/lib/types';
import { useUserData } from '@/components/data-context';
import { HabitCard } from '@/components/cards/habit-card';
import Loading from '@/components/loading';

function HabitsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const { habits, loading, createHabit, updateHabit, deleteHabit } =
    useUserData();

  const handleSave = async (habit: Habit) => {
    try {
      if (habit.id) {
        await updateHabit(habit.id, habit);
      } else {
        const { ...habitData } = habit;
        await createHabit(habitData);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving habit:', error);
    }
  };

  const handleDelete = async (habit: Habit) => {
    try {
      await deleteHabit(habit.id);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  };

  const handleIncrementStreak = async (habit: Habit) => {
    try {
      await updateHabit(habit.id, {
        streak: habit.streak + 1,
        completedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating habit streak:', error);
    }
  };

  if (loading) {
    return <Loading text="Loading Habits..." />;
  }

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
            <HabitCard
              habit={habit}
              key={habit.id}
              setIsModalOpen={setIsModalOpen}
              setSelectedHabit={setSelectedHabit}
              handleIncrementStreak={handleIncrementStreak}
            />
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
