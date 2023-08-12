import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './reducers/loginReducer';
import alertReducer from './reducers/alertReducer';

const store = configureStore({
  reducer: {
    login: loginReducer,
    alert: alertReducer,
  },
});

export default store;
