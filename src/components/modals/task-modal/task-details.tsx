import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface TaskDetailsSectionProps {
  title: string;
  description: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  disabled?: boolean;
}

export const TaskDetailsSection: React.FC<TaskDetailsSectionProps> = ({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
  disabled = false,
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label className="block text-sm font-medium">Title</Label>
        <Input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="w-full p-2 rounded bg-background border"
          required
          disabled={disabled}
        />
      </div>
      <div className="space-y-2">
        <Label className="block text-sm font-medium">Description</Label>
        <Textarea
          placeholder="Describe the task..."
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          className="w-full p-2 rounded bg-background border resize-none"
          rows={2}
          maxLength={500}
          disabled={disabled}
        />
      </div>
    </>
  );
};
