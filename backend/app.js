const express = require('express');
const morgan = require('morgan')
const app = express();
const config = require('./utils/config');
const cors = require('cors');
const mongoose = require('mongoose');

const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');

const mongoUrl = config.MONGODB_URI;
mongoose.connect(mongoUrl).then(() => console.log('connected mongodb'));

app.use(cors());
app.use(express.json());
app.use(morgan('dev'))


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);


module.exports = app;