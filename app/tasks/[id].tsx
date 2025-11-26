import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { TaskForm } from '../../components/TaskForm';
import { useTasks } from '../../lib/contexts/TaskContext';

export default function TaskDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const taskId = Number(id);
  const { getTask, editTask, removeTask } = useTasks();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [taskExists, setTaskExists] = useState(true);

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

  if (!taskExists) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Tarea no encontrada o eliminada</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TaskForm
        initialTitle={task?.title}
        initialDescription={task?.description}
        onSubmit={handleSubmit}
        isLoading={loading}
      />

      <Text onPress={handleDelete} style={styles.deleteText}>
        🗑️ Eliminar tarea
      </Text>

      {formError && <Text style={styles.errorText}>{formError}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 16,
  },
  deleteText: {
    marginTop: 24,
    color: '#ef4444',
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center',
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
  },
});