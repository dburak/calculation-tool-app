import { createSlice } from '@reduxjs/toolkit';
import loginService from '../services/login';
import configurationService from '../services/configuration';

const loginSlice = createSlice({
  name: 'login',
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload;
    },
    logout(state, action) {
      return null;
    },
  },
});

export const setReduxLogin = (email, password) => {
  return async (dispatch) => {
    const loggedUser = await loginService.login({ email, password });
    window.localStorage.setItem('loggedUser', JSON.stringify(loggedUser));
    dispatch(setUser(loggedUser));
  };
};

export const setReduxAuth = (user) => {
  return async (dispatch) => {
    configurationService.setToken(user.token);
    dispatch(setUser(user));
  };
};

export const setReduxLogout = () => {
  return async (dispatch) => {
    dispatch(logout());
  };
};

export const { setUser, logout } = loginSlice.actions;
export default loginSlice.reducer;
