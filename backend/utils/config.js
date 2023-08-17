require('dotenv').config();

const PORT = process.env.PORT;

const MONGODB_URI = process.env.MONGODB_URI;

const SECRET = process.env.SECRET;

const HOST_URL = process.env.HOST_URL || 'http://localhost:3003';

module.exports = {
  MONGODB_URI,
  PORT,
  SECRET,
  HOST_URL,
};
