import { useEffect, useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setReduxAuth } from './reducers/loginReducer';

import LoginPage from './components/LoginPage/LoginPage';
import AdminPage from './components/ConfigurationPage/ConfigurationPage';
import CalculationPage from './components/CalculationPage/CalculationPage';
import Customers from './components/CustomersPage/Customers';
import Navbar from './components/shared/Navbar';
import LoadingSpinner from './components/shared/LoadingSpinner';

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.login);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser');
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON);
      dispatch(setReduxAuth(loggedUser));
    }
    setIsLoading(false);
  }, [dispatch]);

  return (
    <Router>
      <CssBaseline />
      <Navbar user={user} />
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <Routes>
          <Route
            path='/login'
            element={!user ? <LoginPage /> : <Navigate to='/admin' />}
          />
          <Route
            path='/admin'
            element={user ? <AdminPage /> : <Navigate to='/login' />}
          />
          <Route
            path='/customers'
            element={user ? <Customers /> : <Navigate to='/login' />}
          />
          <Route path='/app' element={<CalculationPage />} />
          <Route path='/' element={<Navigate to='/app' />} />
        </Routes>
      )}
    </Router>
  );
};

export default App;
