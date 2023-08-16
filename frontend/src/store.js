import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './reducers/loginReducer';
import alertReducer from './reducers/alertReducer';
import configurationReducer from './reducers/configurationReducer';

const store = configureStore({
  reducer: {
    login: loginReducer,
    alert: alertReducer,
    configuration: configurationReducer,
  },
});

export default store;
