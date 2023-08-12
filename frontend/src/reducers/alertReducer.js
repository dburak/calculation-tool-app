import { createSlice } from '@reduxjs/toolkit';

const alertSlice = createSlice({
  name: 'alert',
  initialState: null,
  reducers: {
    addAlert(state, action) {
      return action.payload;
    },

    reset(state, action) {
      return null;
    },
  },
});

export const setReduxAlert = (obj, time) => {
  return async (dispatch) => {
    dispatch(addAlert(obj));
    setTimeout(() => {
      dispatch(reset());
    }, time * 1000);
  };
};

export const { addAlert, reset } = alertSlice.actions;
export default alertSlice.reducer;
