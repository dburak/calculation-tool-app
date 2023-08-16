import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useDispatch } from 'react-redux';
import { setReduxLogout } from '../../reducers/loginReducer';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser');
    dispatch(setReduxLogout());
    navigate('/');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            Calculation Tool
          </Typography>
          <Button href='/app' color='inherit'>
              App
            </Button>
            <Button href='/admin' color='inherit'>
              Configuration Page
            </Button>
          {!user ? (
            <Button href='/login' color='inherit'>
              Login
            </Button>
          ) : (
            <Button onClick={handleLogout} color='inherit'>
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
