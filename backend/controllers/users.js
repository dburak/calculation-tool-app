const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users);
});

usersRouter.get('/:id', async (request, response) => {
  const userId = request.params.id;
  try {
    const user = await User.findById(userId)
    if (!user) {
      return response.status(404).json({ error: 'User not found' });
    }
    response.json(user);
  } catch (error) {
    response.status(500).json({ error: 'Server error' });
  }
});

usersRouter.post('/', async (request, response, next) => {
  const { email, name, password } = request.body;

  if (email.length < 3 || password.length < 3) {
    return response.status(400).json({
      error: 'email and password must be at least 3 characters long.',
    });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    email,
    name,
    passwordHash,
    isAdmin: false
  });

  try {
    const savedUser = await user.save();

    response.status(201).json(savedUser);
  } catch (error) {
    console.log(error)
  }
});

module.exports = usersRouter;