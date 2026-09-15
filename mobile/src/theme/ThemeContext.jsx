import { createContext, useContext } from 'react';
import { createStyles } from '../styles';

const ThemeContext = createContext(null);
const ThemeModeContext = createContext(false);

export function ThemeProvider({ isDark, children }) {
  const styles = createStyles(isDark);
  return (
    <ThemeModeContext.Provider value={isDark}>
      <ThemeContext.Provider value={styles}>{children}</ThemeContext.Provider>
    </ThemeModeContext.Provider>
  );
}

export function useThemeStyles() {
  return useContext(ThemeContext);
}

export function useThemeIsDark() {
  return useContext(ThemeModeContext);
}
