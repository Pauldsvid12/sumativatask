import axios, { AxiosError } from 'axios';
import { ApiResponse, Task, TaskFormData } from '../types/task';

//URL por la IP de tu computadora  (ipconfig)
const API_URL = 'https://3000-firebase-sumativatask-1764177843484.cluster-r7kbxfo3fnev2vskbkhhphetq6.cloudworkstations.dev';


//Crear instancia de axios con configuración base
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000, // Timeout de 10 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores globalmente
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      // El servidor respondió con un código de error
      console.error(`Error ${error.response.status}:`, error.response.data);
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta
      console.error('No se recibió respuesta del servidor:', error.request);
    } else {
      // Algo pasó al configurar la petición
      console.error('Error al configurar la petición:', error.message);
    }
    return Promise.reject(error);
  }
);

/**
 * Obtiene todas las tareas desde el servidor
 */
export const getTasks = async (): Promise<ApiResponse<Task[]>> => {
  try {
    const response = await apiClient.get<Task[]>('/tasks');
    return { data: response.data };
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    return { 
      error: 'No se pudieron cargar las tareas. Verifica que el servidor esté ejecutándose.' 
    };
  }
};

/**
 * Obtiene una tarea específica por ID
 */
export const getTaskById = async (id: number): Promise<ApiResponse<Task>> => {
  try {
    const response = await apiClient.get<Task>(`/tasks/${id}`);
    return { data: response.data };
  } catch (error) {
    console.error(`Error al obtener tarea ${id}:`, error);
    return { error: 'No se pudo cargar la tarea.' };
  }
};

/**
 * Crea una nueva tarea
 */
export const createTask = async (taskData: TaskFormData): Promise<ApiResponse<Task>> => {
  try {
    const newTask = {
      ...taskData,
      completed: false,
      createdAt: new Date().toISOString()
    };

    const response = await apiClient.post<Task>('/tasks', newTask);
    console.log('Tarea creada correctamente:', response.data);
    return { data: response.data };
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.log('AXIOS ERROR createTask:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
    } else {
      console.log('ERROR createTask desconocido:', error);
    }

    return { error: 'No se pudo crear la tarea.' };
  }
};

/**
 * Actualiza una tarea existente (PATCH para actualización parcial)
 */
export const updateTask = async (
  id: number, 
  taskData: Partial<Task>
): Promise<ApiResponse<Task>> => {
  try {
    const response = await apiClient.patch<Task>(`/tasks/${id}`, taskData);
    return { data: response.data };
  } catch (error) {
    console.error(`Error al actualizar tarea ${id}:`, error);
    return { error: 'No se pudo actualizar la tarea.' };
  }
};

/**
 * Elimina una tarea
 */
export const deleteTask = async (id: number): Promise<ApiResponse<void>> => {
  try {
    await apiClient.delete(`/tasks/${id}`);
    return { data: undefined };
  } catch (error) {
    console.error(`Error al eliminar tarea ${id}:`, error);
    return { error: 'No se pudo eliminar la tarea.' };
  }
};

// Exportar la instancia de axios por si se necesita en otros lugares
export { apiClient };
