'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GoalModal } from '@/components/modals/goal-modal';
import { Goal } from '@/lib/types';
import { useUserData } from '@/components/data-context';
import { GoalCard } from '@/components/cards/goal-card';
import Loading from '@/components/loading';

export default function GoalsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const { goals, refreshAll, loading } = useUserData();

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this goal?')) return;
    try {
      const response = await fetch(`/api/goals/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete goal');
      refreshAll();
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const handleSave = async (goal: Goal) => {
    try {
      const url = editingGoal ? `/api/goals/${editingGoal.id}` : '/api/goals';
      const method = editingGoal ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: goal.name,
          description: goal.description,
        }),
      });

      if (!response.ok) throw new Error('Failed to save goal');
      refreshAll();
    } catch (error) {
      console.error('Error saving goal:', error);
    }
  };

  const openEditDialog = (goal: Goal) => {
    setEditingGoal(goal);
    setIsOpen(true);
  };

  if (loading) {
    return <Loading text="Loading Goals..." />;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Goals</h1>
          <p className="text-sm text-muted-foreground">
            Organize your habits and tasks with meaningful goals
          </p>
        </div>
        <Button
          size="sm"
          className="px-3"
          onClick={() => {
            setEditingGoal(null);
            setIsOpen(true);
          }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Goal
        </Button>
      </div>

      {/* Goals grid */}
      {goals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <Plus className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No goals yet</h3>
          <p className="text-sm text-muted-foreground text-center max-w-sm mb-6">
            Create your first goal to start organizing your habits and tasks in
            a meaningful way.
          </p>
          <Button
            size="sm"
            onClick={() => {
              setEditingGoal(null);
              setIsOpen(true);
            }}>
            Create your first goal
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={openEditDialog}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <GoalModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onSave={handleSave}
        onDelete={
          editingGoal ? async (goal) => handleDelete(goal.id) : undefined
        }
        initialGoal={editingGoal}
      />
    </div>
  );
}
