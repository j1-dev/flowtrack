'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GoalModal } from '@/components/goal-modal';

import type { Goal } from '@/lib/types';
import { useUserData } from '@/components/data-context';

export default function GoalsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const { goals, refreshAll } = useUserData();

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this goal?')) return;

    try {
      const response = await fetch(`/api/goals/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete goal');
      refreshAll();
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const openEditDialog = (goal: Goal) => {
    setEditingGoal(goal);
    setIsOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
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

        <GoalModal
          open={isOpen}
          onClose={() => setIsOpen(false)}
          onSave={async (goal) => {
            try {
              const url = editingGoal
                ? `/api/goals/${editingGoal.id}`
                : '/api/goals';
              const method = editingGoal ? 'PUT' : 'POST';

              const response = await fetch(url, {
                method,
                headers: {
                  'Content-Type': 'application/json',
                },
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
          }}
          onDelete={
            editingGoal
              ? async (goal) => {
                  try {
                    const response = await fetch(`/api/goals/${goal.id}`, {
                      method: 'DELETE',
                    });

                    if (!response.ok) throw new Error('Failed to delete goal');
                    refreshAll();
                  } catch (error) {
                    console.error('Error deleting goal:', error);
                  }
                }
              : undefined
          }
          initialGoal={editingGoal}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className="group p-6 rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-lg tracking-tight">
                {goal.name}
              </h3>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEditDialog(goal)}
                  className="text-muted-foreground hover:text-foreground transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(goal.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            {goal.description && (
              <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
                {goal.description}
              </p>
            )}
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <span>{goal.tasks.length} tasks</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                <span>{goal.habits.length} habits</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {goals.length === 0 && (
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
      )}
    </div>
  );
}
