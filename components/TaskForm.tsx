import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { ValidationError } from '../lib/types/task';
import { validateTaskForm } from '../lib/utils/validation';

interface TaskFormProps {
  initialTitle?: string;
  initialDescription?: string;
  onSubmit: (title: string, description: string) => void;
  submitButtonText?: string;
  isLoading?: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  initialTitle = '',
  initialDescription = '',
  onSubmit,
  submitButtonText = 'Guardar',
  isLoading = false,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [touched, setTouched] = useState({ title: false, description: false });

  // Actualizar valores si cambian las props iniciales (útil para edición)
  useEffect(() => {
    setTitle(initialTitle);
    setDescription(initialDescription);
  }, [initialTitle, initialDescription]);

  const handleSubmit = () => {
    // Marcar todos los campos como tocados
    setTouched({ title: true, description: true });

    // Validar formulario
    const validationErrors = validateTaskForm(title, description);
    setErrors(validationErrors);

    // Si no hay errores, enviar datos
    if (validationErrors.length === 0) {
      onSubmit(title.trim(), description.trim());
    }
  };

  const getErrorMessage = (field: 'title' | 'description'): string | undefined => {
    if (!touched[field]) return undefined;
    return errors.find(err => err.field === field)?.message;
  };

  const handleTitleChange = (text: string) => {
    setTitle(text);
    if (touched.title) {
      const validationErrors = validateTaskForm(text, description);
      setErrors(validationErrors);
    }
  };

  const handleDescriptionChange = (text: string) => {
    setDescription(text);
    if (touched.description) {
      const validationErrors = validateTaskForm(title, text);
      setErrors(validationErrors);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Campo Título */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Título *</Text>
          <TextInput
            style={[
              styles.input,
              getErrorMessage('title') && touched.title && styles.inputError,
            ]}
            value={title}
            onChangeText={handleTitleChange}
            onBlur={() => setTouched(prev => ({ ...prev, title: true }))}
            placeholder="Ingresa el título de la tarea"
            editable={!isLoading}
            maxLength={100}
          />
          {getErrorMessage('title') && (
            <Text style={styles.errorText}>{getErrorMessage('title')}</Text>
          )}
        </View>

        {/* Campo Descripción */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Descripción *</Text>
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              getErrorMessage('description') && touched.description && styles.inputError,
            ]}
            value={description}
            onChangeText={handleDescriptionChange}
            onBlur={() => setTouched(prev => ({ ...prev, description: true }))}
            placeholder="Describe los detalles de la tarea"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            editable={!isLoading}
            maxLength={500}
          />
          {getErrorMessage('description') && (
            <Text style={styles.errorText}>{getErrorMessage('description')}</Text>
          )}
        </View>

        {/* Botón de envío */}
        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Guardando...' : submitButtonText}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  inputError: {
    borderColor: '#ef4444',
    borderWidth: 2,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginTop: 4,
  },
  button: {
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
