import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { Provider } from 'react-redux';
import store from './store';

const theme = createTheme({
  palette: {
    primary: {
      main: '#373242',
    },
    secondary: {
      main: '#d50000',
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </Provider>
);
