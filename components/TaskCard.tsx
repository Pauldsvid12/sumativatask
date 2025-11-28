import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Task } from '../lib/types/task';
import { useRouter } from 'expo-router';
import { useTheme } from '../lib/contexts/ThemeContext';
import { Edit, Trash, CheckCircle, Circle } from 'lucide-react-native';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void; // Cambiado a string
  onDelete: (id: string) => void;         // Cambiado a string
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleComplete,
  onDelete,
}) => {
  const router = useRouter();
  const { theme } = useTheme();

  const backgroundColor = theme === 'light' ? '#fff' : '#1e1e1e';
  const textColor = theme === 'light' ? '#1f2937' : '#ddd';
  const subTextColor = theme === 'light' ? '#6b7280' : '#aaa';

  const handleDelete = () => {
    Alert.alert(
      'Eliminar tarea',
      '¿Estás seguro de que deseas eliminar esta tarea?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => onDelete(task.id),
        },
      ]
    );
  };

  const handleEdit = () => {
    // Navegación con params.id como string
    router.push({
      pathname: '/tasks/[id]',
      params: { id: task.id },
    });
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <View style={[styles.card, { backgroundColor }]}>
      {/* Encabezado con título y estado */}
      <View style={styles.header}>
        <Text
          style={[
            styles.title,
            { color: textColor },
            task.completed && styles.titleCompleted,
          ]}
          numberOfLines={1}
        >
          {task.title}
        </Text>
        <View
          style={[
            styles.badge,
            task.completed ? styles.badgeCompleted : styles.badgePending,
          ]}
        >
          <Text style={styles.badgeText}>
            {task.completed ? 'Completada' : 'Pendiente'}
          </Text>
        </View>
      </View>

      {/* Descripción */}
      <Text
        style={[
          styles.description,
          { color: subTextColor },
          task.completed && styles.descriptionCompleted,
        ]}
        numberOfLines={2}
      >
        {task.description}
      </Text>

      {/* Fecha */}
      <Text style={[styles.date, { color: subTextColor }]}>
        Creada: {formatDate(task.createdAt)}
      </Text>

      {/* Botones de acción */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.toggleButton]}
          onPress={() => onToggleComplete(task.id)}
        >
          {task.completed ? (
            <CheckCircle size={18} color="#065f46" />
          ) : (
            <Circle size={18} color="#1f2937" />
          )}
          <Text style={styles.actionButtonText}>
            {task.completed ? ' Pendiente' : ' Completar'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={handleEdit}
        >
          <Edit size={18} color="#1f2937" />
          <Text style={styles.actionButtonText}> Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDelete}
        >
          <Trash size={18} color="#b91c1c" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeCompleted: {
    backgroundColor: '#d1fae5',
  },
  badgePending: {
    backgroundColor: '#fef3c7',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#065f46',
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  descriptionCompleted: {
    opacity: 0.6,
  },
  date: {
    fontSize: 12,
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  toggleButton: {
    backgroundColor: '#dbeafe',
  },
  editButton: {
    backgroundColor: '#e0e7ff',
  },
  deleteButton: {
    backgroundColor: '#fee2e2',
    flex: 0.3,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1f2937',
    marginLeft: 4,
  },
});
