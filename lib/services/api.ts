import { Task, TaskFormData, ApiResponse } from '../types/task';

//IP de tu computadora (ipconfig)
const API_URL = 'http://localhost:3000'; // O http://TU_IP:3000

/**
 * Obtiene todas las tareas desde el servidor
 */
export const getTasks = async (): Promise<ApiResponse<Task[]>> => {
  try {
    const response = await fetch(`${API_URL}/tasks`);
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    return { error: 'No se pudieron cargar las tareas. Verifica que el servidor esté ejecutándose.' };
  }
};

/**
 * Obtiene una tarea específica por ID
 */
export const getTaskById = async (id: number): Promise<ApiResponse<Task>> => {
  try {
    const response = await fetch(`${API_URL}/tasks/${id}`);
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    return { data };
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

    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTask),
    });
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('Error al crear tarea:', error);
    return { error: 'No se pudo crear la tarea.' };
  }
};

/**
 * Actualiza una tarea existente
 */
export const updateTask = async (id: number, taskData: Partial<Task>): Promise<ApiResponse<Task>> => {
  try {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    return { data };
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
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    return { data: undefined };
  } catch (error) {
    console.error(`Error al eliminar tarea ${id}:`, error);
    return { error: 'No se pudo eliminar la tarea.' };
  }
};
