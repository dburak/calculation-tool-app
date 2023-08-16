import { createSlice } from '@reduxjs/toolkit';
import configurationService from '../services/configuration';

const configurationSlice = createSlice({
  name: 'configuration',
  initialState: null,
  reducers: {
    setConfiguration(state, action) {
      return action.payload;
    },
    getConfiguration(state, action) {
      return action.payload;
    },
    removeConfiguration(state, action) {
      return null;
    },
  },
});

export const setReduxConfig = (inputPages, outputPage, formulaList) => {
  return async (dispatch) => {
    let formData = new FormData();

    inputPages.forEach((page) => {
      if (page.image) {
        formData.append('image', page.image);
      }
    });
    formData.append('image', outputPage.image);

    formData.append('inputPages', JSON.stringify(inputPages));
    formData.append('outputPage', JSON.stringify(outputPage));
    formData.append('formulaList', JSON.stringify(formulaList));

    const newConfig = await configurationService.sendConfig(formData);
    dispatch(setConfiguration(newConfig));
  };
};

export const getReduxConfig = () => {
  return async (dispatch) => {
    const configs = await configurationService.getConfigs();
    dispatch(getConfiguration(configs));
  };
};

export const removeReduxConfig = () => {
  return async (dispatch) => {
    dispatch(removeConfiguration());
  };
};

export const { setConfiguration, removeConfiguration, getConfiguration } =
  configurationSlice.actions;
export default configurationSlice.reducer;
