const bcrypt = require('bcrypt');
const User = require('../models/user');

createUser = async (email, name, password) => {
  if (email.length < 3 || password.length < 3) {
    throw new Error('Email and password must be at least 3 characters long.');
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    email,
    name,
    passwordHash,
  });

  const savedUser = await user.save();
  return savedUser;
};

module.exports = {
  createUser,
};
