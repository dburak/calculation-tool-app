import axios from 'axios';
const baseUrl = '/api';

const login = async (credentials) => {
  const response = await axios.post(`${baseUrl}/login`, credentials);
  return response.data;
};

const getUsers = () => {
  const request = axios.get(`${baseUrl}/users`);
  return request.then((response) => response.data);
};

const getUser = (userId) => {
  const request = axios.get(`${baseUrl}/users/${userId}`);
  return request.then((response) => response.data);
};

// eslint-disable-next-line import/no-anonymous-default-export
export default { login, getUsers, getUser };