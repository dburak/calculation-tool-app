const express = require('express');
const router = express.Router();
const userService = require('../services/user-service');

router.post('/', async (request, response) => {
  const { email, name, password } = request.body;

  try {
    const savedUser = await userService.createUser(email, name, password);
    response.status(201).json(savedUser);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
