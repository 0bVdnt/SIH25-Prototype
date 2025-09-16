// src/theme.js
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#56cfe1', // Primary actions
    },
    background: {
      default: '#0d1b2a',
      paper: 'rgba(23, 42, 58, 0.8)', // Semi-transparent paper color
    },
    text: {
      primary: '#e0e1dd',
      secondary: '#b0b5b3',
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
  },
});