import React from 'react';
import WeatherWidget from './components/WeatherWidget';
import NewsWidget from './components/NewsWidget';
import AddTaskForm from './components/AddTaskForm';
import TaskList from './components/TaskList';
import { useTasks } from './hooks/useTasks';
import './App.css';

const App: React.FC = () => {
  const { tasks, addTask, toggleTask, deleteTask } = useTasks();

  const handleAddTask = (text: string) => {
    addTask(text);
  };

  const handleToggleTask = (taskId: string) => {
    toggleTask(taskId);
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
  };

  return (
    <div className="container">
      <header className="app-header">
        <h1>Todo & 天气 & 新闻</h1>
      </header>
      
      <main className="app-main">
        <div className="main-layout">
          <div className="todo-section">
            <h2>待办事项</h2>
            <AddTaskForm onAddTask={handleAddTask} />
            <div className="task-list-container">
              <TaskList 
                tasks={tasks}
                onToggle={handleToggleTask}
                onDelete={handleDeleteTask}
              />
            </div>
          </div>
          
          <div className="right-section">
            <div className="weather-section">
              <WeatherWidget />
            </div>
            
            <div className="news-section">
              <NewsWidget />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
