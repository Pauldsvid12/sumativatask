import React, { useMemo } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { TaskCard } from '../components/TaskCard';
import { EmptyState } from '../components/EmptyState';
import { useTasks } from '../lib/contexts/TaskContext';
import { useRouter } from 'expo-router';
import { Header } from '../components/Header';
import { useTheme } from '../lib/contexts/ThemeContext';
import { Plus } from 'lucide-react-native';

export default function Home() {
  const { tasks, loading, error, toggleTaskComplete, removeTask } = useTasks();
  const router = useRouter();
  const { colors } = useTheme();

  const handleAddTask = () => {
    router.push('/tasks/new');
  };

  //Lógica de ordenamiento
  const visibleTasks = useMemo(() => {
    return tasks
      .slice() //copia para no mutar el array original
      .sort((a, b) => {
        // 1. las que tienen fecha de vencimiento osea las que son urgentes
        if (a.dueDate && b.dueDate) {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        //si tiene fecha de vencimiento va primero
        if (a.dueDate) return -1;
        if (b.dueDate) return 1;
        //2. Las nuevas van primero si no tiene fecha
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
  }, [tasks]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Mis Tareas" />
      
      <TouchableOpacity
        style={[
          styles.addButton, 
          { 
            backgroundColor: colors.primary, 
            shadowColor: colors.primary 
          }
        ]}
        onPress={handleAddTask}
        activeOpacity={0.8}
      >
        <Plus color="#fff" width={24} height={24} />
        <Text style={styles.addButtonText}> Nueva Tarea</Text>
      </TouchableOpacity>

      {loading && (
        <Text style={[styles.infoText, { color: colors.text }]}>
          Cargando tareas...
        </Text>
      )}
      
      {error && (
        <Text style={[styles.infoText, styles.errorText]}>
          {error}
        </Text>
      )}

      {!loading && visibleTasks.length === 0 && <EmptyState />}

      <FlatList
        data={visibleTasks}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onToggleComplete={toggleTaskComplete}
            onDelete={removeTask}
          />
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  addButton: {
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 8,
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
