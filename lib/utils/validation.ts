import { ValidationError } from '../types/task';

/**
 * Valida que el campo no esté vacío y solo contenga caracteres alfanuméricos y espacios
 */
export const validateAlphanumeric = (value: string, fieldName: 'title' | 'description'): ValidationError | null => {
  // Verificar si está vacío
  if (!value.trim()) {
    return {
      field: fieldName,
      message: `El ${fieldName === 'title' ? 'título' : 'descripción'} no puede estar vacío`
    };
  }

  // Validar solo alfanuméricos, espacios, y caracteres básicos de puntuación
  const alphanumericRegex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s.,;:()-]+$/;
  
  if (!alphanumericRegex.test(value)) {
    return {
      field: fieldName,
      message: `El ${fieldName === 'title' ? 'título' : 'descripción'} solo puede contener letras, números y puntuación básica`
    };
  }

  // Validar longitud mínima
  if (value.trim().length < 3) {
    return {
      field: fieldName,
      message: `El ${fieldName === 'title' ? 'título' : 'descripción'} debe tener al menos 3 caracteres`
    };
  }

  return null;
};

/**
 * Valida todos los campos del formulario de tareas
 */
export const validateTaskForm = (title: string, description: string): ValidationError[] => {
  const errors: ValidationError[] = [];

  const titleError = validateAlphanumeric(title, 'title');
  if (titleError) errors.push(titleError);

  const descriptionError = validateAlphanumeric(description, 'description');
  if (descriptionError) errors.push(descriptionError);

  return errors;
};
