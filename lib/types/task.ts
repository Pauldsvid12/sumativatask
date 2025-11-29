export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  startDate?: string;
  dueDate?: string; 
}

export interface TaskFormData {
  title: string;
  description: string;
  startDate?: string;
  dueDate?: string;
}

export interface ValidationError {
  field: 'title' | 'description';
  message: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}