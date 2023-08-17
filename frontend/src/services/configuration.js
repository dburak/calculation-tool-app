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
      Authorization: token,
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

const deleteConfig = async () => {
  const response = await axios.delete(`${baseUrl}/configurations`);
  return response.data;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default { getConfigs, sendConfig, deleteConfig, setToken };
