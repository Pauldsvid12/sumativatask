import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TaskForm } from '../../components/TaskForm';
import { useTasks } from '../../lib/contexts/TaskContext';
import { useRouter } from 'expo-router';

export default function NewTask() {
  const { addTask } = useTasks();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (title: string, description: string) => {
    setLoading(true);
    setFormError(null);
    const success = await addTask({ title, description });
    setLoading(false);
    
    if (success) {
      router.push('/');
    } else {
      setFormError('Error al guardar la tarea. Intenta nuevamente.');
    }
  };

  return (
    <View style={styles.container}>
      <TaskForm onSubmit={handleSubmit} isLoading={loading} />

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
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});