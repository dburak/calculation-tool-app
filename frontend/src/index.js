import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import CssBaseline from '@mui/material/CssBaseline';

import { Provider } from 'react-redux';
import store from './store';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginPage from './components/LoginPage';
import AdminPage from './components/AdminPage';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <Router>
      <CssBaseline />
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/admin' element={<AdminPage />} />
        <Route path='/' element={<App />} />
      </Routes>
    </Router>
  </Provider>
);
