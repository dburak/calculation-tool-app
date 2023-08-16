import axios from 'axios';
const baseUrl = '/api';

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const sendConfig = async (credentials) => {
  const response = await axios.post(`${baseUrl}/configurations`, credentials, {
    headers: {
      Authorization: token,
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

const getConfigs = async () => {
  const response = await axios.get(`${baseUrl}/configurations`);
  return response.data;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default { sendConfig, getConfigs, setToken };
