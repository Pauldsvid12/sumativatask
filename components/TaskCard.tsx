import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Task } from '../lib/types/task';
import { useRouter } from 'expo-router';
import { useTheme } from '../lib/contexts/ThemeContext';
import { Edit, Trash, CheckCircle, Circle, Clock } from 'lucide-react-native';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}
export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleComplete,
  onDelete,
}) => {
  const router = useRouter();
  const { colors, theme } = useTheme();

  //PROTECCIÓN CONTRA ERRORES DE RENDERIZADO:
  //si task no existe o no es un objeto no renderizamos nada
  if (!task || typeof task !== 'object') return null;

  //extraer strings seguros para evitar renderizar objetos accidentalmente
  const titleSafe = typeof task.title === 'string' ? task.title : 'Sin título';
  const descSafe = typeof task.description === 'string' ? task.description : '';
  const idSafe = String(task.id);

  const now = new Date();
  const isExpired = task.dueDate && new Date(task.dueDate) < now && !task.completed;
  const isDueSoon = task.dueDate && !isExpired && !task.completed && 
    new Date(task.dueDate).toDateString() === now.toDateString();

  const handleDelete = () => {
    Alert.alert(
      'Eliminar tarea',
      '¿Estás seguro de que deseas eliminar esta tarea?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => onDelete(idSafe),
        },
      ]
    );
  };

  const handleEdit = () => {
    router.push({
      pathname: '/tasks/[id]',
      params: { id: idSafe },
    });
  };

  const formatNiceDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return '';
    }
  };

  const cardContainerStyle = [
    styles.card,
    {
      backgroundColor: colors.card,
      borderColor: isExpired ? colors.danger : (theme === 'dark' ? '#333' : 'transparent'),
      borderWidth: theme === 'dark' || isExpired ? 1 : 0,
      shadowColor: isExpired ? colors.danger : (theme === 'dark' ? '#ffffff' : '#000'),
      shadowOpacity: theme === 'dark' ? 0.1 : 0.08,
      shadowRadius: theme === 'dark' ? 6 : 4,
      elevation: theme === 'dark' ? 3 : 2,
    }
  ];

  const getBadgeColor = () => {
    if (isExpired) return '#fee2e2';
    if (isDueSoon) return '#fef3c7';
    return colors.background;
  };

  const getBadgeTextColor = () => {
    if (isExpired) return colors.danger;
    if (isDueSoon) return '#d97706';
    return colors.subtext;
  };

  return (
    <View style={cardContainerStyle}>
      <View style={styles.header}>
        {/* Usamos titleSafe para asegurar que es string */}
        <Text
          style={[
            styles.title,
            { color: colors.text },
            task.completed && styles.titleCompleted,
          ]}
          numberOfLines={1}
        >
          {titleSafe}
        </Text>
        
        {task.dueDate && (
          <View style={[styles.badge, { backgroundColor: getBadgeColor() }]}>
            <Clock size={12} color={getBadgeTextColor()} />
            <Text style={[styles.badgeText, { color: getBadgeTextColor() }]}>
              {isExpired ? 'Vencida' : formatNiceDate(task.dueDate)}
            </Text>
          </View>
        )}
      </View>

      {descSafe ? (
        <Text
          style={[
            styles.description,
            { color: colors.subtext },
            task.completed && styles.descriptionCompleted,
          ]}
          numberOfLines={2}
        >
          {descSafe}
        </Text>
      ) : null}

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.leftAction}
          onPress={() => onToggleComplete(idSafe)}
          activeOpacity={0.7}
        >
          {task.completed ? (
            <CheckCircle size={22} color={colors.accent} />
          ) : (
            <Circle size={22} color={colors.subtext} />
          )}
          <Text style={[styles.actionText, { color: task.completed ? colors.accent : colors.subtext }]}>
            {task.completed ? ' Completada' : ' Pendiente'}
          </Text>
        </TouchableOpacity>

        <View style={styles.rightActions}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={handleEdit}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Edit size={20} color={colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconBtn}
            onPress={handleDelete}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Trash size={20} color={colors.danger} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
  },
  description: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  descriptionCompleted: {
    opacity: 0.6,
  },
  divider: {
    height: 1,
    width: '100%',
    marginBottom: 12,
    opacity: 0.5,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  rightActions: {
    flexDirection: 'row',
    gap: 16,
  },
  iconBtn: {
    padding: 4,
  }
});