import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { TaskCard } from '../components/TaskCard';
import { EmptyState } from '../components/EmptyState';
import { useTasks } from '../lib/contexts/TaskContext';
import { useRouter } from 'expo-router';
import { Header } from '../components/Header';
import { useTheme } from '../lib/contexts/ThemeContext';
import { Plus } from 'lucide-react-native'; // icono para añadir

export default function Home() {
  const {
    tasks,
    loading,
    error,
    toggleTaskComplete,
    removeTask,
  } = useTasks();
  const router = useRouter();
  const { theme } = useTheme();

  const backgroundColor = theme === 'light' ? '#f9fafb' : '#121212';
  const textColor = theme === 'light' ? '#111' : '#eee';

  const handleAddTask = () => {
    router.push('/tasks/new');
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Header title="Gestión de Tareas" />
      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddTask}
        activeOpacity={0.7}
      >
        <Plus color="white" width={24} height={24} />
        <Text style={styles.addButtonText}> Nueva Tarea</Text>
      </TouchableOpacity>

      {loading && (
        <Text style={[styles.infoText, { color: textColor }]}>
          Cargando tareas...
        </Text>
      )}
      {error && (
        <Text style={[styles.infoText, styles.errorText]}>
          {error}
        </Text>
      )}

      {!loading && tasks.length === 0 && <EmptyState />}

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onToggleComplete={toggleTaskComplete}
            onDelete={removeTask}
          />
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    // backgroundColor dinámico se aplica inline
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  infoText: {
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 8,
  },
  errorText: {
    color: '#ef4444',
  },
});