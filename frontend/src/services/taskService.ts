import type { Task, TaskService } from '../types';

export class LocalTaskService implements TaskService {
  private tasks: Map<string, Task> = new Map();

  constructor() {
    this.loadFromStorage();
  }

  createTask(text: string): Task | null {
    if (!text || !text.trim()) {
      return null;
    }

    const task: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: text.trim(),
      completed: false,
      createdAt: new Date()
    };

    this.tasks.set(task.id, task);
    this.saveToStorage();
    return task;
  }

  toggleTask(taskId: string): Task | null {
    const task = this.tasks.get(taskId);
    if (!task) return null;

    task.completed = !task.completed;
    task.updatedAt = new Date();
    
    this.saveToStorage();
    return task;
  }

  deleteTask(taskId: string): boolean {
    const deleted = this.tasks.delete(taskId);
    if (deleted) {
      this.saveToStorage();
    }
    return deleted;
  }

  getAllTasks(): Task[] {
    return Array.from(this.tasks.values()).sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
    );
  }

  updateTaskText(taskId: string, text: string): Task | null {
    if (!text || !text.trim()) return null;

    const task = this.tasks.get(taskId);
    if (!task) return null;

    task.text = text.trim();
    task.updatedAt = new Date();
    
    this.saveToStorage();
    return task;
  }

  private saveToStorage(): void {
    try {
      const tasks = this.getAllTasks();
      const serializedTasks = tasks.map(task => ({
        ...task,
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt?.toISOString()
      }));
      localStorage.setItem('todo-app-tasks', JSON.stringify(serializedTasks));
    } catch (error) {
      console.error('保存任务失败:', error);
    }
  }

  private loadFromStorage(): void {
    try {
      const data = localStorage.getItem('todo-app-tasks');
      if (!data) return;

      const serializedTasks = JSON.parse(data);
      this.tasks.clear();
      
      serializedTasks.forEach((taskData: any) => {
        const task: Task = {
          ...taskData,
          createdAt: new Date(taskData.createdAt),
          updatedAt: taskData.updatedAt ? new Date(taskData.updatedAt) : undefined
        };
        this.tasks.set(task.id, task);
      });
    } catch (error) {
      console.error('加载任务失败:', error);
    }
  }
}