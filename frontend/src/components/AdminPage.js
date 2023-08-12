import { useEffect } from 'react';
import Navbar from './Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { setReduxAuth } from '../reducers/loginReducer';
import AlertBox from './AlertBox';

const AdminPage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.login);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(setReduxAuth(user));
    }
  }, [dispatch]);

  return (
    <>
      <Navbar user={user} />
      <div>AdminPage</div>
      <AlertBox />
    </>
  );
};

export default AdminPage;
