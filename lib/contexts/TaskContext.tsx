import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import * as api from '../services/api';
import { Task, TaskFormData } from '../types/task';

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  addTask: (taskData: TaskFormData) => Promise<boolean>;
  editTask: (id: number, taskData: Partial<Task>) => Promise<boolean>;
  removeTask: (id: number) => Promise<boolean>;
  toggleTaskComplete: (id: number) => Promise<boolean>;
  getTask: (id: number) => Task | undefined;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //cargar tareas al montar el componente
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
    setError(null);
    
    const response = await api.createTask(taskData);
    
    if (response.data) {
      setTasks(prevTasks => [...prevTasks, response.data!]);
      setLoading(false);
      return true;
    } else if (response.error) {
      setError(response.error);
      setLoading(false);
      return false;
    }
    
    setLoading(false);
    return false;
  };

  const editTask = async (id: number, taskData: Partial<Task>): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    const response = await api.updateTask(id, taskData);
    
    if (response.data) {
      setTasks(prevTasks =>
        prevTasks.map(task => (task.id === id ? response.data! : task))
      );
      setLoading(false);
      return true;
    } else if (response.error) {
      setError(response.error);
      setLoading(false);
      return false;
    }
    
    setLoading(false);
    return false;
  };

  const removeTask = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    const response = await api.deleteTask(id);
    
    if (response.error) {
      setError(response.error);
      setLoading(false);
      return false;
    }
    
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    setLoading(false);
    return true;
  };

  const toggleTaskComplete = async (id: number): Promise<boolean> => {
    const task = tasks.find(t => t.id === id);
    if (!task) return false;
    
    return await editTask(id, { completed: !task.completed });
  };

  const getTask = (id: number): Task | undefined => {
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

//hook personalizado para usar el contexto
export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks debe ser usado dentro de un TaskProvider');
  }
  return context;
};
