import axios from 'axios';
const baseUrl = '/api';

const getCustomers = () => {
  const request = axios.get(`${baseUrl}/customers`);
  return request.then((response) => response.data);
};

const sendCustomer = (credentials) => {
  const request = axios.post(`${baseUrl}/customers`, credentials);
  return request.then((response) => response.data);
};

const deleteCustomer = (credentials) => {
  const request = axios.delete(`${baseUrl}/customers`, credentials);
  return request.then((response) => response.data);
};

// eslint-disable-next-line import/no-anonymous-default-export
export default { getCustomers, sendCustomer, deleteCustomer };
