export interface Task {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    createdAt: string;
  }
  
  export interface TaskFormData {
    title: string;
    description: string;
  }
  
  export interface ValidationError {
    field: 'title' | 'description';
    message: string;
  }
  
  export interface ApiResponse<T> {
    data?: T;
    error?: string;
  }
  