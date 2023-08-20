const Customer = require('../models/customer');

createCustomer = async (name, surname, phoneNumber) => {
  const customer = new Customer({
    name,
    surname,
    phoneNumber,
  });

  const savedCustomer = await customer.save();
  return savedCustomer;
};

getCustomers = async () => {
  const configs = await Customer.find({});
  return configs;
};

const deleteCustomer = async (customerArray) => {
  const deletedCustomers = [];
  try {
    for (const customerId of customerArray) {
      const deletedCustomer = await Customer.findByIdAndDelete(customerId);
      if (deletedCustomer) {
        deletedCustomers.push(deletedCustomer);
      }
    }

    return { message: `${deletedCustomers.length} customer(s) deleted.` };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createCustomer,
  getCustomers,
  deleteCustomer,
};
