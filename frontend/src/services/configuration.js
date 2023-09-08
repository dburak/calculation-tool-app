import axios from 'axios';
const baseUrl = '/api';

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getConfigs = async () => {
  const response = await axios.get(`${baseUrl}/configurations`);
  return response.data;
};

const sendConfig = async (credentials) => {
  const response = await axios.put(`${baseUrl}/configurations`, credentials, {
    headers: {
      authorization: token,
      'Content-Type': 'multipart/form-data',
      //'Content-Type': 'application/json',
    },
  });
  return response.data;
};

const deleteConfig = async () => {
  const response = await axios.delete(`${baseUrl}/configurations`);
  return response.data;
};

const deleteInputValue = async (id) => {
  const response = await axios.delete(
    `${baseUrl}/configurations/inputpage/value/${id}`
  );
  return response.data;
};

const deleteInputPage = async (id) => {
  const response = await axios.delete(
    `${baseUrl}/configurations/inputpage/${id}`
  );
  return response.data;
};

const deleteOutputValue = async (id) => {
  const response = await axios.delete(
    `${baseUrl}/configurations/outputpage/value/${id}`
  );
  return response.data;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getConfigs,
  sendConfig,
  deleteConfig,
  setToken,
  deleteInputValue,
  deleteInputPage,
  deleteOutputValue,
};
