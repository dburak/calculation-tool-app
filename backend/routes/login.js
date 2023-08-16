const express = require('express');
const router = express.Router();
const loginService = require('../services/login-service');

router.post('/', async (request, response) => {
  const { email, password } = request.body;

  try {
    const user = await loginService.login(email, password);
    response.status(200).json(user);
  } catch (error) {
    response.status(401).json({ error: error.message });
  }
});

module.exports = router;
