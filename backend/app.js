const express = require('express');
const morgan = require('morgan');
const app = express();
const config = require('./utils/config');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const configurationsRouter = require('./controllers/configurations');
const calculationRouter = require('./controllers/calculation');

const mongoUrl = config.MONGODB_URI;
mongoose.connect(mongoUrl).then(() => console.log('connected mongodb'));

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('OK');
});

app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/configurations', configurationsRouter);
app.use('/api/calculation', calculationRouter);

module.exports = app;
