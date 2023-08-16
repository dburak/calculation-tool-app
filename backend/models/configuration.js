const mongoose = require('mongoose');

const configurationSchema = new mongoose.Schema({
  inputPages: [
    {
      title: String,
      description: String,
      image: String,
      inputValues: [
        {
          placeholder: String,
          variable: String,
        },
      ],
    },
  ],
  outputPage: {
    title: String,
    description: String,
    image: String,
    outputValues: [
      {
        placeholder: String,
        variable: String,
      },
    ],
    outputUnit: String,
  },
  formulaList: [String],
});

configurationSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Configuration', configurationSchema);
