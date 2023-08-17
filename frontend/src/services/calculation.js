import axios from 'axios';
const baseUrl = '/api';

const sendCalculation = async (credentials) => {
  const response = await axios.post(`${baseUrl}/calculation`, credentials);
  return response.data;
};

const checkCalculation = async (credentials) => {
  const response = await axios.post(
    `${baseUrl}/calculation/check-calculation`,
    credentials
  );
  return response.data;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default { sendCalculation, checkCalculation };
