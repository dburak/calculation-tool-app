const express = require('express');
const router = express.Router();
const calculationService = require('../services/calculation-service');

router.post('/', async (request, response) => {
  const { formulaList, inputValues } = request.body;

  try {
    let results = await calculationService.performCalculations(
      formulaList,
      inputValues
    );

    for (const key in results) {
      if (results.hasOwnProperty(key) && results[key] === 'Calculation Error') {
        results = null;
      }
    }

    results
      ? response.json(results)
      : response.status(500).json({ error: 'Internal Server Error' });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
