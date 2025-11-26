import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { TaskForm } from '../../components/TaskForm';
import { useTasks } from '../../lib/contexts/TaskContext';
import { useRouter } from 'expo-router';
import { useTheme } from '../../lib/contexts/ThemeContext';
import { X } from 'lucide-react-native'; // icono para cancelar

export default function NewTask() {
  const { addTask } = useTasks();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const router = useRouter();
  const { theme } = useTheme();

  const backgroundColor = theme === 'light' ? '#f9fafb' : '#121212';
  const textColor = theme === 'light' ? '#111' : '#eee';

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

  const handleCancel = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>Nueva Tarea</Text>
        <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
          <X color={textColor} width={28} height={28} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.formContainer}>
        <TaskForm onSubmit={handleSubmit} isLoading={loading} />

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
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});