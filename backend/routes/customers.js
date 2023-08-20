const express = require('express');
const router = express.Router();
const customerService = require('../services/customer-service');

router.post('/', async (request, response) => {
  const { name, surname, phoneNumber } = request.body;

  try {
    const savedCustomer = await customerService.createCustomer(
      name,
      surname,
      phoneNumber
    );
    response.status(201).json(savedCustomer);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/', async (request, response) => {
  try {
    const customers = await customerService.getCustomers();
    response.json(customers);
  } catch (error) {
    response.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/', async (request, response) => {
  const customerArray = request.body;

  try {
    const numberOfDeletedCustomer = await customerService.deleteCustomer(
      customerArray
    );

    response.json(numberOfDeletedCustomer);
  } catch (error) {
    response.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
