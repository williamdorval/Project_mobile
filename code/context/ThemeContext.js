import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [dark, setDark] = useState(false);
  const toggle = () => setDark(d => !d);

   const theme = {
    dark,
    colors: dark
      ? {
          background: '#000000ff',   
          card: '#343135ff',
          text: '#fff',
          accent: '#7c010fff',       
          accentAlt: '#e3526e',    
          action: '#86f4ee',       
          muted: '#bdbdbd',
        }
      : {
          background: '#ffffff',
          card: '#f5f5f5',
          text: '#2b2236',
          accent: '#e91c4c',
          accentAlt: '#e3526e',
          action: '#025d93',       
          muted: '#9f5f91',
        },
    toggle,
  };

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);