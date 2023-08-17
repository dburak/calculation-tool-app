import { createSlice } from '@reduxjs/toolkit';
import configurationService from '../services/configuration';
import calculationService from '../services/calculation';

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

export const saveReduxConfig = (inputPages, outputPage, formulaList) => {
  return async (dispatch) => {
    let formData = new FormData();
    const formulaCheckingData = {};

    inputPages.forEach((page) => {
      page.inputValues.forEach((inputValue) => {
        formulaCheckingData[inputValue.variable] = '1';
      });
    });

    inputPages.forEach((page) => {
      if (page.image.image) {
        formData.append('image', page.image.image);
        formData.append('imageIndexArray', page.image.index);
      } else {
        formData.append('imageIndexArray', undefined);
      }
    });
    formData.append('image', outputPage.image.image);
    formData.append('imageIndexArray', outputPage.image.index);

    formData.append('inputPages', JSON.stringify(inputPages));
    formData.append('outputPage', JSON.stringify(outputPage));
    formData.append('formulaList', JSON.stringify(formulaList));

    await calculationService.sendCalculation({
      formulaList,
      inputValues: formulaCheckingData,
    });

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
    await configurationService.deleteConfig();
    dispatch(removeConfiguration());
  };
};

export const { setConfiguration, removeConfiguration, getConfiguration } =
  configurationSlice.actions;
export default configurationSlice.reducer;
