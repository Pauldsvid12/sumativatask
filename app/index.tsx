import React from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { TaskCard } from '../components/TaskCard';
import { EmptyState } from '../components/EmptyState';
import { useTasks } from '../lib/contexts/TaskContext';
import { useRouter } from 'expo-router';

export default function Home() {
  const { tasks, loading, error, fetchTasks, toggleTaskComplete, removeTask } = useTasks();
  const router = useRouter();

  const handleAddTask = () => {
    router.push('/tasks/new');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
        <Text style={styles.addButtonText}>+ Nueva Tarea</Text>
      </TouchableOpacity>

      {loading && <Text style={styles.infoText}>Cargando tareas...</Text>}
      {error && <Text style={[styles.infoText, styles.errorText]}>{error}</Text>}

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
    backgroundColor: '#f9fafb',
  },
  addButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
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
    color: '#374151',
  },
  errorText: {
    color: '#ef4444',
  },
});