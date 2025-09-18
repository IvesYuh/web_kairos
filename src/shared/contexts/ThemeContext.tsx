import React, { ReactNode, useCallback, useContext, useMemo, useState } from "react";
import { createContext } from "react"; // Alteração: o 'vm' não é adequado para esse caso.
import { ThemeProvider } from "@emotion/react";
import { Box } from "@mui/material";
import { DarkTheme, LightTheme } from "./../themes";

interface IThemeContextData {
  themeName: 'light' | 'dark';
  toggleTheme: () => void;
}

const defaultValue: IThemeContextData = {
  themeName: 'light',
  toggleTheme: () => {}
};

const ThemeContext = createContext<IThemeContextData>(defaultValue);

interface AppThemeProviderProps {
  children: ReactNode; 
}

export const useAppThemeContext = () => {
  return useContext(ThemeContext);
};

export const AppThemeProvider: React.FC<AppThemeProviderProps> = ({ children }) => {
  const [themeName, setThemeName] = useState<'light' | 'dark'>('light');
  
  const toggleTheme = useCallback(() => {
    setThemeName((oldThemeName) => (oldThemeName === 'light' ? 'dark' : 'light'));
  }, []);
  
  const theme = useMemo(() => {
    return themeName === 'light' ? LightTheme : DarkTheme;
  }, [themeName]);

  return (
    <ThemeContext.Provider value={{ themeName, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <Box width={"100vw"} height={"100vh"} bgcolor={theme.palette.background.default}>
          {children}
        </Box>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};