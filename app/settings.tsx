import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Switch } from 'react-native';
import { useTheme } from '../lib/contexts/ThemeContext';
import { useTasks } from '../lib/contexts/TaskContext';
import { useRouter } from 'expo-router';
import { Moon, Sun, ArrowLeft, Trash2, Info, Github } from 'lucide-react-native';

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { tasks, removeTask } = useTasks();
  const router = useRouter();

  const backgroundColor = theme === 'light' ? '#f9fafb' : '#121212';
  const cardBg = theme === 'light' ? '#ffffff' : '#1e1e1e';
  const textColor = theme === 'light' ? '#111' : '#eee';
  const subTextColor = theme === 'light' ? '#666' : '#aaa';
  const borderColor = theme === 'light' ? '#eee' : '#333';

  const handleDeleteAll = () => {
    if (tasks.length === 0) {
      Alert.alert("Info", "No hay tareas para eliminar");
      return;
    }

    Alert.alert(
      'Zona de Peligro',
      '¿Estás seguro de que quieres eliminar TODAS las tareas? Esto no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, eliminar todo',
          style: 'destructive',
          onPress: async () => {
            const promises = tasks.map(t => removeTask(t.id));
            await Promise.all(promises);
            Alert.alert("Éxito", "Todas las tareas han sido eliminadas");
          },
        },
      ]
    );
  };

  const SettingsSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: subTextColor }]}>{title.toUpperCase()}</Text>
      <View style={[styles.sectionContent, { backgroundColor: cardBg, borderColor }]}>
        {children}
      </View>
    </View>
  );

  const SettingsItem = ({ 
    icon: Icon, 
    label, 
    value, 
    onPress, 
    isLast = false,
    color = textColor 
  }: any) => (
    <TouchableOpacity 
      style={[
        styles.item, 
        !isLast && { borderBottomWidth: 1, borderBottomColor: borderColor }
      ]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.itemLeft}>
        <View style={[styles.iconContainer, { backgroundColor: theme === 'light' ? '#f3f4f6' : '#333' }]}>
          <Icon size={20} color={color} />
        </View>
        <Text style={[styles.itemLabel, { color }]}>{label}</Text>
      </View>
      {value}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: cardBg, borderBottomColor: borderColor }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color={textColor} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>Configuración</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Sección Apariencia */}
        <SettingsSection title="Apariencia">
          <SettingsItem
            icon={theme === 'light' ? Sun : Moon}
            label="Modo Oscuro"
            isLast
            value={
              <Switch
                value={theme === 'dark'}
                onValueChange={(val) => setTheme(val ? 'dark' : 'light')}
                trackColor={{ false: "#767577", true: "#3b82f6" }}
                thumbColor={"#f4f3f4"}
              />
            }
          />
        </SettingsSection>

        {/* Sección Datos */}
        <SettingsSection title="Datos y Almacenamiento">
          <SettingsItem
            icon={Trash2}
            label={`Eliminar todas las tareas (${tasks.length})`}
            onPress={handleDeleteAll}
            color="#ef4444"
            isLast
          />
        </SettingsSection>

        {/* Sección Acerca de */}
        <SettingsSection title="Acerca de">
          <SettingsItem
            icon={Info}
            label="Versión de la App"
            value={<Text style={{ color: subTextColor }}>1.0.0</Text>}
          />
          <SettingsItem
            icon={Github}
            label="Repositorio del Proyecto"
            isLast
            value={<Text style={{ color: subTextColor }}>Ver</Text>}
          />
        </SettingsSection>

        <Text style={[styles.footerText, { color: subTextColor }]}>
          Desarrollado con Expo & React Native
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  content: { padding: 20 },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  sectionContent: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    padding: 8,
    borderRadius: 8,
  },
  itemLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 20,
  }
});
