import { createContext, useContext, ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Theme {
  colors: {
    card: string;
    text: string;
    border: string;
    accent: string;
  };
}

const lightTheme: Theme = {
  colors: {
    card: '#ffffff',
    text: '#1a1a1a',
    border: '#e0e0e0',
    accent: '#0066cc',
  },
};

const darkTheme: Theme = {
  colors: {
    card: '#1e1e1e',
    text: '#f0f0f0',
    border: '#3a3a3a',
    accent: '#4da6ff',
  },
};

export const themes = { light: lightTheme, dark: darkTheme } as const;

export type ThemeName = keyof typeof themes;

const ThemeContext = createContext<Theme>(lightTheme);

export const useAppTheme = () => useContext(ThemeContext);

export const AppThemeProvider = ({ name, children }: { name: ThemeName; children: ReactNode }) => (
  <ThemeContext.Provider value={themes[name] ?? lightTheme}>{children}</ThemeContext.Provider>
);

export const ThemedCard = ({ title, description }: { title: string; description: string }) => {
  const theme = useAppTheme();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
      ]}
    >
      <Text style={[styles.title, { color: theme.colors.accent }]}>{title}</Text>
      <Text style={[styles.description, { color: theme.colors.text }]}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
});
