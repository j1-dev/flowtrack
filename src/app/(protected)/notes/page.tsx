/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useUserData } from '@/components/data-context';
import Loading from '@/components/loading';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import React, { useState } from 'react';
import {
  Clock,
  Target,
  CheckSquare,
  Repeat,
  X,
  Send,
  Calendar,
  Trash2,
} from 'lucide-react';
import { Note } from '@/lib/types';

const DataSelect = ({
  data,
  value,
  onChange,
  placeholder,
  icon,
}: {
  data: any[];
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder: string;
  icon: React.ReactNode;
}) => (
  <div className="flex items-center gap-3">
    <div className="text-foreground">{icon}</div>
    <Select value={value ?? ''} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {data.map((item) => (
          <SelectItem key={item.id} value={item.id}>
            {item.name || item.title || item.content}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

const NoteCard = ({
  note,
  onDelete,
}: {
  note: Note;
  onDelete: (id: string) => void;
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="relative rounded-lg p-6 mb-4 border group">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm ">
          <Clock className="w-4 h-4" />
          {formatDate(note.createdAt.toString())}
        </div>
        <div className="flex gap-2">
          {note.taskId && (
            <span className="px-2 py-1 text-xs dark:bg-green-900/30 dark:text-green-400 bg-green-300 text-green-900 rounded-md flex items-center gap-1">
              <CheckSquare className="w-3 h-3" />
              Task
            </span>
          )}
          {note.habitId && (
            <span className="px-2 py-1 text-xs dark:bg-orange-900/30 dark:text-orange-400 bg-orange-300 text-orange-900 rounded-md flex items-center gap-1">
              <Repeat className="w-3 h-3" />
              Habit
            </span>
          )}
          {note.goalId && (
            <span className="px-2 py-1 text-xs dark:bg-purple-900/30 dark:text-purple-400 bg-purple-300 text-purple-900 rounded-md flex items-center gap-1">
              <Target className="w-3 h-3" />
              Goal
            </span>
          )}
        </div>
      </div>
      <p className="text-foreground leading-relaxed whitespace-pre-wrap">
        {note.content}
      </p>
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(note.id)}
          className="h-8 w-8 p-0 text-destructive hover:text-destructive absolute bottom-4 right-4">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

function NotesPage() {
  const { tasks, habits, goals, notes, loading, refreshAll } = useUserData();
  const [content, setContent] = useState('');
  const [taskId, setTaskId] = useState<string | null>(null);
  const [habitId, setHabitId] = useState<string | null>(null);
  const [goalId, setGoalId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendNote = async () => {
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, taskId, habitId, goalId }),
      });

      if (response.ok) {
        setContent('');
        setTaskId(null);
        setHabitId(null);
        setGoalId(null);
        refreshAll();
      } else {
        console.error('Failed to send note');
      }
    } catch (error) {
      console.error('Error sending note:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        refreshAll();
      } else {
        console.error('Failed to delete note');
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const clearAttachment = (type: 'task' | 'habit' | 'goal') => {
    switch (type) {
      case 'task':
        setTaskId(null);
        break;
      case 'habit':
        setHabitId(null);
        break;
      case 'goal':
        setGoalId(null);
        break;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSendNote();
    }
  };

  const hasAttachments = taskId || habitId || goalId;
  const sortedNotes =
    notes?.sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
    ) || [];

  if (loading) {
    return <Loading text="Loading Notes..." />;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Note Composer */}
      <div className="bg-muted rounded-lg p-6 mb-8 border">
        <Textarea
          placeholder="What's on your mind? Share your thoughts, insights, or reflections..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          className="h-24 bg-transparent border-none text-foreground placeholder-gray-400 resize-none focus:ring-0 focus:outline-none text-base mb-4"
        />

        {/* Attachments */}
        <div className="space-y-4 mb-6 inline-flex gap-3">
          <DataSelect
            data={tasks || []}
            value={taskId}
            onChange={setTaskId}
            placeholder="Link to a task (optional)"
            icon={<CheckSquare className="w-4 h-4" />}
          />

          <DataSelect
            data={habits || []}
            value={habitId}
            onChange={setHabitId}
            placeholder="Link to a habit (optional)"
            icon={<Repeat className="w-4 h-4" />}
          />

          <div>
            {/* If the last element of this div is left ouside the div, it gets misaligned */}
            <DataSelect
              data={goals || []}
              value={goalId}
              onChange={setGoalId}
              placeholder="Link to a goal (optional)"
              icon={<Target className="w-4 h-4 " />}
            />
          </div>
        </div>

        {/* Active Attachments */}
        {hasAttachments && (
          <div className="flex flex-wrap gap-2 mb-6">
            {taskId && (
              <span className="px-3 py-1 dark:bg-green-900/30 dark:text-green-400 bg-green-300 text-green-900 rounded-md text-sm flex items-center gap-2">
                <CheckSquare className="w-3 h-3" />
                Task linked
                <X
                  className="w-3 h-3 cursor-pointer hover:text-green-300"
                  onClick={() => clearAttachment('task')}
                />
              </span>
            )}
            {habitId && (
              <span className="px-3 py-1 dark:bg-orange-900/30 dark:text-orange-400 bg-orange-300 text-orange-900 rounded-md text-sm flex items-center gap-2">
                <Repeat className="w-3 h-3" />
                Habit linked
                <X
                  className="w-3 h-3 cursor-pointer hover:text-orange-300"
                  onClick={() => clearAttachment('habit')}
                />
              </span>
            )}
            {goalId && (
              <span className="px-3 py-1 dark:bg-purple-900/30 dark:text-purple-400 bg-purple-300 text-purple-900 rounded-md text-sm flex items-center gap-2">
                <Target className="w-3 h-3" />
                Goal linked
                <X
                  className="w-3 h-3 cursor-pointer hover:text-purple-300"
                  onClick={() => clearAttachment('goal')}
                />
              </span>
            )}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-500">
            Press Cmd/Ctrl + Enter to post
          </p>
          <Button
            onClick={handleSendNote}
            disabled={!content.trim() || isSubmitting}
            className="bg-white text-black hover:bg-gray-200 flex items-center gap-2">
            <Send className="w-4 h-4" />
            {isSubmitting ? 'Posting...' : 'Post Note'}
          </Button>
        </div>
      </div>

      {/* Timeline */}
      <div className="h-[50vh] overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Your Timeline</h2>
          <span className="px-2 py-1 text-xs  text-gray-300 rounded border">
            {sortedNotes.length} notes
          </span>
        </div>

        {sortedNotes.length === 0 ? (
          <div className="rounded-lg p-12 text-center border">
            <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2 text-white">
              No notes yet
            </h3>
            <p className="text-gray-400">
              Start capturing your thoughts and reflections above
            </p>
          </div>
        ) : (
          <div className="space-y-0 relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 "></div>

            {sortedNotes.map((note) => (
              <div key={note.id} className="relative pl-16">
                {/* Timeline dot */}
                <div className="absolute left-4 w-4 h-4 bg-white rounded-full border-4 border-gray-900"></div>

                <NoteCard note={note} onDelete={handleDeleteNote} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default NotesPage;
