import React from 'react';
import type { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
  return (
    <li className={`task-item fade-in ${task.completed ? 'completed' : ''}`}>
      <div className="task-content" onClick={() => onToggle(task.id)}>
        <input 
          type="checkbox" 
          className="task-checkbox" 
          checked={task.completed}
          onChange={() => onToggle(task.id)}
        />
        <label className="task-label">{task.text}</label>
      </div>
      <button 
        className="delete-button" 
        onClick={() => onDelete(task.id)}
        title="删除任务"
      >
        ×
      </button>
    </li>
  );
};

export default TaskItem;