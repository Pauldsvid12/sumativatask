import axios, { AxiosError } from 'axios';
import { Task, TaskFormData, ApiResponse } from '../types/task';

//URL por la IP de tu computadora (ipconfig)
const API_URL = 'https://3000-firebase-sumativatask-1764177843484.cluster-r7kbxfo3fnev2vskbkhhphetq6.cloudworkstations.dev';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error('API Error:', error.message);
    return Promise.reject(error);
  }
);

export const getTasks = async (): Promise<ApiResponse<Task[]>> => {
  try {
    const response = await apiClient.get<Task[]>('/tasks');
    return { data: response.data };
  } catch (error) {
    return { error: 'No se pudieron cargar las tareas.' };
  }
};

// CAMBIO AQUÍ: id: string
export const getTaskById = async (id: string): Promise<ApiResponse<Task>> => {
  try {
    const response = await apiClient.get<Task>(`/tasks/${id}`);
    return { data: response.data };
  } catch (error) {
    return { error: 'No se pudo cargar la tarea.' };
  }
};

export const createTask = async (taskData: TaskFormData): Promise<ApiResponse<Task>> => {
  try {
    const newTask = {
      ...taskData,
      completed: false,
      createdAt: new Date().toISOString()
    };
    const response = await apiClient.post<Task>('/tasks', newTask);
    return { data: response.data };
  } catch (error) {
    return { error: 'No se pudo crear la tarea.' };
  }
};

// CAMBIO AQUÍ: id: string
export const updateTask = async (
  id: string, 
  taskData: Partial<Task>
): Promise<ApiResponse<Task>> => {
  try {
    const response = await apiClient.patch<Task>(`/tasks/${id}`, taskData);
    return { data: response.data };
  } catch (error) {
    return { error: 'No se pudo actualizar la tarea.' };
  }
};

export const deleteTask = async (id: string): Promise<ApiResponse<void>> => {
  try {
    await apiClient.delete(`/tasks/${id}`);
    return { data: undefined };
  } catch (error) {
    return { error: 'No se pudo eliminar la tarea.' };
  }
};
