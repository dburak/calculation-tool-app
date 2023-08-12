import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { setReduxLogin } from '../reducers/loginReducer';
import { setReduxAlert } from '../reducers/alertReducer';
import { useDispatch } from 'react-redux';
import AlertBox from './AlertBox';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [isTouched, setIsTouched] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  let re = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

  const handleLogin = (event) => {
    event.preventDefault();

    if (re.test(email)) {
      if (password.trim() !== '') {
        setIsValidPassword(true);
        dispatch(setReduxLogin(email, password))
          .then(() => {
            setEmail('');
            setPassword('');
            dispatch(
              setReduxAlert(
                {
                  message: "You're successfully logged in!",
                  type: 'success',
                },
                4
              )
            );
            navigate('/admin');
          })
          .catch((error) => {
            dispatch(
              setReduxAlert(
                {
                  message: 'wrong username or password',
                  type: 'error',
                },
                4
              )
            );
          });
      } else {
        setIsValidPassword(false);
      }
    } else {
      setIsValidEmail(false);
    }
  };

  const handleEmailInput = (event) => {
    setEmail(event.target.value);
    if (re.test(email)) {
      setIsValidEmail(true);
    } else {
      setIsValidEmail(false);
    }
  };

  const defaultTheme = createTheme();

  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <Container component='main' maxWidth='xs'>
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component='h1' variant='h5'>
              Admin Login Page
            </Typography>
            <Box
              component='form'
              onSubmit={handleLogin}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin='normal'
                required
                fullWidth
                id='email'
                label='Email Address'
                name='email'
                value={email}
                onChange={handleEmailInput}
                autoComplete='off'
                autoFocus
                type='email'
                error={!isValidEmail && isTouched}
                helperText={
                  !isValidEmail && isTouched
                    ? 'Enter a valid email address'
                    : ''
                }
                onBlur={() => setIsTouched(true)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'></InputAdornment>
                  ),
                }}
              />
              <TextField
                margin='normal'
                required
                fullWidth
                name='password'
                label='Password'
                value={password}
                onChange={({ target }) => setPassword(target.value)}
                error={!isValidPassword}
                helperText={!isValidPassword ? 'Enter a password' : ''}
                type='password'
                id='password'
                autoComplete='off'
              />
              <Button
                type='submit'
                fullWidth
                variant='contained'
                sx={{ mt: 3, mb: 2 }}
              >
                LOGIN
              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
      <AlertBox />
    </>
  );
};

export default LoginPage;
