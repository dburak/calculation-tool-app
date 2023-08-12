import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setReduxAuth } from '../reducers/loginReducer';
import AlertBox from './AlertBox';

const AdminPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(setReduxAuth(user));
    }
  }, [dispatch]);

  return (
    <>
      <div>AdminPage</div>
      <AlertBox />
    </>
  );
};

export default AdminPage;
