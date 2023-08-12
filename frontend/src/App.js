import { useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setReduxAuth } from './reducers/loginReducer';

import LoginPage from './components/LoginPage';
import AdminPage from './components/AdminPage';
import CalculationPage from './components/CalculationPage';
import Navbar from './components/Navbar';

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.login);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser');
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON);
      dispatch(setReduxAuth(loggedUser));
    }
  }, [dispatch]);

  return (
    <Router>
      <CssBaseline />
      <Navbar user={user} />
      <Routes>
        <Route
          path='/login'
          element={!user ? <LoginPage /> : <Navigate to='/admin' />}
        />
        <Route
          path='/admin'
          element={user ? <AdminPage /> : <Navigate to='/login' />}
        />
        <Route path='/app' element={<CalculationPage />} />
        <Route path='/' element={<Navigate to='/app' />} />
      </Routes>
    </Router>
  );
};

export default App;
