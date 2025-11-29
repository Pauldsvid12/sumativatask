import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'light' | 'dark';

export const themeColors = {
  light: {
    background: '#f3f4f6',       //gris muy claro
    card: '#ffffff',             //blanco
    text: '#1f2937',             //gris oscuro casi negro
    subtext: '#6b7280',
    primary: '#3b82f6',          //azul clasico
    border: '#e5e7eb',
    accent: '#10b981',           //verde para éxitos
    danger: '#ef4444',
    inputBg: '#ffffff',
    glow: 'transparent',         //sin brillo en light
  },
  dark: {
    background: '#0a0a0a',       //negro casi puro
    card: '#171717',             //gris muy oscuro (plomo oscuro)
    text: '#e5e5e5',             //blanco hueso
    subtext: '#a3a3a3',          //gris medio
    primary: '#525252',          //gris plomo para botones principales
    border: '#262626',           //borde sutil
    accent: '#d4d4d4',           //acento sutil
    danger: '#991b1b',           //rojo oscuro
    inputBg: '#171717',
    glow: '#ffffff15',           //brillo blanco sutil (sombra)
  }
};

interface ThemeContextType {
  theme: Theme;
  colors: typeof themeColors.light; //tipo dinamico
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const THEME_KEY = 'app_theme';

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('light');

  useEffect(() => {
    (async () => {
      const savedTheme = await AsyncStorage.getItem(THEME_KEY) as Theme;
      if (savedTheme) {
        setThemeState(savedTheme);
      } else {
        setThemeState(Appearance.getColorScheme() === 'dark' ? 'dark' : 'light');
      }
    })();
  }, []);

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    await AsyncStorage.setItem(THEME_KEY, newTheme);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  //seleccionamos los colores segun el tema actual
  const colors = themeColors[theme];

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme debe usarse dentro de ThemeProvider');
  return context;
};