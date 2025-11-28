import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task, TaskFormData } from '../types/task';
import * as api from '../services/api';

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  addTask: (taskData: TaskFormData) => Promise<boolean>;
  
  // CAMBIOS AQUÍ: id es string
  editTask: (id: string, taskData: Partial<Task>) => Promise<boolean>;
  removeTask: (id: string) => Promise<boolean>;
  toggleTaskComplete: (id: string) => Promise<boolean>;
  getTask: (id: string) => Task | undefined;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    const response = await api.getTasks();
    if (response.data) {
      setTasks(response.data);
    } else if (response.error) {
      setError(response.error);
    }
    setLoading(false);
  };

  const addTask = async (taskData: TaskFormData): Promise<boolean> => {
    setLoading(true);
    const response = await api.createTask(taskData);
    if (response.data) {
      setTasks(prev => [...prev, response.data!]);
      setLoading(false);
      return true;
    } else {
      setError(response.error || 'Error al crear');
      setLoading(false);
      return false;
    }
  };

  // CAMBIO: id: string
  const editTask = async (id: string, taskData: Partial<Task>): Promise<boolean> => {
    setLoading(true);
    const response = await api.updateTask(id, taskData);
    if (response.data) {
      setTasks(prev => prev.map(t => (t.id === id ? response.data! : t)));
      setLoading(false);
      return true;
    } else {
      setError(response.error || 'Error al editar');
      setLoading(false);
      return false;
    }
  };

  // CAMBIO: id: string
  const removeTask = async (id: string): Promise<boolean> => {
    setLoading(true);
    const response = await api.deleteTask(id);
    if (!response.error) {
      setTasks(prev => prev.filter(t => t.id !== id));
      setLoading(false);
      return true;
    } else {
      setError(response.error || 'Error al eliminar');
      setLoading(false);
      return false;
    }
  };

  // CAMBIO: id: string
  const toggleTaskComplete = async (id: string): Promise<boolean> => {
    const task = tasks.find(t => t.id === id);
    if (!task) return false;
    return await editTask(id, { completed: !task.completed });
  };

  // CAMBIO: id: string
  const getTask = (id: string): Task | undefined => {
    return tasks.find(task => task.id === id);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        error,
        fetchTasks,
        addTask,
        editTask,
        removeTask,
        toggleTaskComplete,
        getTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks debe ser usado dentro de un TaskProvider');
  }
  return context;
};
