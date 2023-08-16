const express = require('express');
const router = express.Router();
const calculationService = require('../services/calculation-service');

router.post('/', async (request, response) => {
  const { formulaList, inputValues } = request.body;

  try {
    const results = await calculationService.performCalculations(
      formulaList,
      inputValues
    );
    response.json(results);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
