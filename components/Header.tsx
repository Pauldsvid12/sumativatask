import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Settings } from 'lucide-react-native';
import { useTheme } from '../lib/contexts/ThemeContext';

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  const router = useRouter();
  const { colors, theme } = useTheme();

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: theme === 'dark' ? colors.card : colors.primary,
        borderBottomWidth: theme === 'dark' ? 1 : 0,
        borderBottomColor: colors.border
      }
    ]}>
      <Text style={[styles.title, { color: '#fff' }]}>{title}</Text>
      <TouchableOpacity onPress={() => router.push('/settings')}>
        <Settings color="#fff" size={24} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
});