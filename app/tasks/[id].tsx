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
  ActivityIndicator,
} from 'react-native';
import { TaskForm } from '../../components/TaskForm';
import { useTasks } from '../../lib/contexts/TaskContext';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../../lib/contexts/ThemeContext';
import { Trash, ArrowLeft } from 'lucide-react-native';
import { Task } from '../../lib/types/task';
import * as api from '../../lib/services/api';

export default function TaskDetail() {
  const params = useLocalSearchParams();
  const taskId = Array.isArray(params.id) ? params.id[0] : params.id;

  const { tasks, editTask, removeTask, loading: contextLoading } = useTasks();
  const router = useRouter();
  const { theme } = useTheme();

  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [currentTask, setCurrentTask] = useState<Task | undefined>(undefined);
  const [formError, setFormError] = useState<string | null>(null);

  const backgroundColor = theme === 'light' ? '#f9fafb' : '#121212';
  const textColor = theme === 'light' ? '#111' : '#eee';
  const cardBg = theme === 'light' ? '#fff' : '#1e1e1e';

  useEffect(() => {
    const findTask = async () => {
      if (!taskId) {
        console.error('ID no válido:', taskId);
        setInitializing(false);
        return;
      }

      const foundInContext = tasks.find((t) => t.id === taskId);

      if (foundInContext) {
        setCurrentTask(foundInContext);
        setInitializing(false);
      } else {
        try {
          const response = await api.getTaskById(taskId);
          if (response.data) {
            setCurrentTask(response.data);
          }
        } catch (error) {
          console.error('Error buscando tarea:', error);
        } finally {
          setInitializing(false);
        }
      }
    };

    if (!contextLoading) {
      findTask();
    }
  }, [taskId, tasks, contextLoading]);

  const handleSubmit = async (title: string, description: string) => {
    if (!taskId) return;
    
    setLoading(true);
    setFormError(null);
    
    const success = await editTask(taskId, { title, description });
    setLoading(false);

    if (success) {
      router.back();
    } else {
      setFormError('Error al actualizar la tarea.');
    }
  };

  const handleDelete = () => {
    if (!taskId) return;

    Alert.alert(
      'Eliminar tarea',
      '¿Seguro que deseas eliminar esta tarea?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            const success = await removeTask(taskId);
            setLoading(false);
            if (success) {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace('/');
              }
            } else {
              Alert.alert('Error', 'No se pudo eliminar la tarea.');
            }
          },
        },
      ]
    );
  };

  if (initializing) {
    return (
      <View style={[styles.centered, { backgroundColor }]}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={{ color: textColor, marginTop: 10 }}>Cargando tarea...</Text>
      </View>
    );
  }

  if (!currentTask) {
    return (
      <View style={[styles.centered, { backgroundColor }]}>
        <Text style={[styles.errorText, { fontSize: 18, marginBottom: 10 }]}>Tarea no encontrada</Text>
        <TouchableOpacity onPress={() => router.replace('/')} style={styles.primaryButton}>
          <ArrowLeft color="#fff" size={20} />
          <Text style={styles.primaryButtonText}>Volver al Inicio</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={[styles.container, { backgroundColor }]}>
      <View style={[styles.header, { backgroundColor: cardBg, borderBottomColor: theme === 'light' ? '#eee' : '#333' }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <ArrowLeft color={textColor} size={24} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: textColor }]}>Editar Tarea</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.formContainer}>
        <TaskForm
          initialTitle={currentTask.title}
          initialDescription={currentTask.description}
          onSubmit={handleSubmit}
          isLoading={loading}
          submitButtonText="Actualizar Tarea"
        />
        <View style={[styles.divider, { backgroundColor: theme === 'light' ? '#eee' : '#333' }]} />
        <TouchableOpacity onPress={handleDelete} style={[styles.deleteButton, { borderColor: '#ef4444', borderWidth: 1 }]} disabled={loading}>
          <Trash color="#ef4444" width={20} height={20} />
          <Text style={styles.deleteText}>Eliminar esta tarea</Text>
        </TouchableOpacity>
        {formError && <Text style={[styles.errorText, { marginTop: 10 }]}>{formError}</Text>}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { height: 60, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, borderBottomWidth: 1 },
  iconButton: { padding: 8 },
  title: { fontSize: 18, fontWeight: '600' },
  formContainer: { padding: 20 },
  divider: { height: 1, marginVertical: 24 },
  deleteButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 14, borderRadius: 8, backgroundColor: 'rgba(239, 68, 68, 0.1)' },
  deleteText: { color: '#ef4444', fontWeight: '600', fontSize: 16, marginLeft: 8 },
  errorText: { color: '#ef4444', textAlign: 'center' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  primaryButton: { flexDirection: 'row', backgroundColor: '#3b82f6', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8, alignItems: 'center', gap: 8 },
  primaryButtonText: { color: '#fff', fontWeight: '600' },
});
