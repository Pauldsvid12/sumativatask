import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { TaskForm } from '../../components/TaskForm';
import { useTasks } from '../../lib/contexts/TaskContext';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../../lib/contexts/ThemeContext';
import { Trash, X } from 'lucide-react-native';

export default function TaskDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const taskId = Number(id);
  const { getTask, editTask, removeTask } = useTasks();
  const router = useRouter();
  const { theme } = useTheme();

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [taskExists, setTaskExists] = useState(true);

  const backgroundColor = theme === 'light' ? '#f9fafb' : '#121212';
  const textColor = theme === 'light' ? '#111' : '#eee';

  const task = getTask(taskId);

  useEffect(() => {
    if (!task) {
      setTaskExists(false);
    }
  }, [task]);

  const handleSubmit = async (title: string, description: string) => {
    setLoading(true);
    setFormError(null);
    const success = await editTask(taskId, { title, description });
    setLoading(false);

    if (success) {
      router.push('/');
    } else {
      setFormError('Error al actualizar la tarea. Intenta de nuevo.');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar tarea',
      '¿Seguro que deseas eliminar esta tarea?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const success = await removeTask(taskId);
            if (success) {
              router.push('/');
            } else {
              Alert.alert('Error', 'No se pudo eliminar la tarea.');
            }
          },
        },
      ]
    );
  };

  const handleCancel = () => {
    router.back();
  };

  if (!taskExists) {
    return (
      <View style={[styles.centered, { backgroundColor }]}>
        <Text style={[styles.errorText]}>Tarea no encontrada o eliminada</Text>
        <TouchableOpacity onPress={() => router.push('/')} style={styles.backButton}>
          <Text style={{ color: '#3b82f6' }}>Volver al inicio</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>Editar Tarea</Text>
        <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
          <X color={textColor} width={28} height={28} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.formContainer}>
        <TaskForm
          initialTitle={task?.title}
          initialDescription={task?.description}
          onSubmit={handleSubmit}
          isLoading={loading}
        />

        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
          <Trash color="#ef4444" width={24} height={24} />
          <Text style={styles.deleteText}>Eliminar tarea</Text>
        </TouchableOpacity>

        {formError && <Text style={[styles.errorText]}>{formError}</Text>}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cancelButton: {
    padding: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  formContainer: {
    padding: 16,
  },
  deleteButton: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteText: {
    color: '#ef4444',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 8,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    marginTop: 16,
  },
});