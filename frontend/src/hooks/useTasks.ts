import { useState, useEffect } from 'react';
import type { Task } from '../types';
import { LocalTaskService } from '../services/taskService';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskService] = useState(() => new LocalTaskService());

  const loadTasks = () => {
    const allTasks = taskService.getAllTasks();
    setTasks(allTasks);
  };

  const addTask = (text: string): boolean => {
    const task = taskService.createTask(text);
    if (task) {
      loadTasks();
      return true;
    }
    return false;
  };

  const toggleTask = (taskId: string): boolean => {
    const task = taskService.toggleTask(taskId);
    if (task) {
      loadTasks();
      return true;
    }
    return false;
  };

  const deleteTask = (taskId: string): boolean => {
    const success = taskService.deleteTask(taskId);
    if (success) {
      loadTasks();
    }
    return success;
  };

  const updateTask = (taskId: string, text: string): boolean => {
    const task = taskService.updateTaskText(taskId, text);
    if (task) {
      loadTasks();
      return true;
    }
    return false;
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);

  return {
    tasks,
    completedTasks,
    pendingTasks,
    addTask,
    toggleTask,
    deleteTask,
    updateTask,
    refresh: loadTasks
  };
};