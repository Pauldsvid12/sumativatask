import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../lib/contexts/ThemeContext';
import { useRouter } from 'expo-router';

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configuración</Text>

      <Text style={styles.label}>Tema actual: {theme}</Text>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.button, theme === 'light' && styles.selected]}
          onPress={() => setTheme('light')}
        >
          <Text>Claro</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, theme === 'dark' && styles.selected]}
          onPress={() => setTheme('dark')}
        >
          <Text>Oscuro</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text>Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingTop: 32 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
  label: { marginBottom: 8 },
  buttons: { flexDirection: 'row', gap: 16, marginBottom: 32 },
  button: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  selected: {
    backgroundColor: '#3b82f6',
    borderColor: '#2563eb',
    color: '#fff',
  },
  backButton: {
    padding: 10,
  },
});
