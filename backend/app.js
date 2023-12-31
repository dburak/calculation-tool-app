const express = require('express');
const morgan = require('morgan');
const app = express();
const config = require('./utils/config');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');
const configurationsRouter = require('./routes/configurations');
const calculationRouter = require('./routes/calculation');
const customersRouter = require('./routes/customers');

const errorHandler = require('./middleware/error-handler');

const mongoUrl = config.MONGODB_URI;
mongoose.connect(mongoUrl).then(() => console.log('connected mongodb'));

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/configurations', configurationsRouter);
app.use('/api/calculation', calculationRouter);
app.use('/api/customers', customersRouter);

app.use(errorHandler);

app.use(express.static(path.join(__dirname, '/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/build/index.html'));
});

module.exports = app;
