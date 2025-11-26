import { ThemeProvider } from '../lib/contexts/ThemeContext';
import { TaskProvider } from '../lib/contexts/TaskContext';
import React from 'react';
import { Slot } from 'expo-router';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <TaskProvider>
        <Slot />
      </TaskProvider>
    </ThemeProvider>
  );
}