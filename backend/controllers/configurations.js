const configurationsRouter = require('express').Router();
const Configuration = require('../models/configuration');
const config = require('../utils/config');

const fileUpload = require('../middleware/file-upload');

configurationsRouter.get('/', async (request, response) => {
  const configs = await Configuration.find({});
  response.json(configs[0]);
});

configurationsRouter.post(
  '/',
  fileUpload.array('image'),
  async (request, response) => {
    const { inputPages, outputPage, formulaList } = request.body;

    const parsedInputPages = JSON.parse(inputPages);
    const parsedOutputPage = JSON.parse(outputPage);
    const parsedFormulaList = JSON.parse(formulaList);

    const lastIndex = request.files.length - 1;

    for (let index = 0; index < lastIndex; index++) {
      const file = request.files[index];
      const imagePath = file.path;
      parsedInputPages[index].image = `${config.HOST_URL}/${imagePath}`;
    }

    const lastFile = request.files[lastIndex];
    const lastImagePath = lastFile.path;
    parsedOutputPage.image = `${config.HOST_URL}/${lastImagePath}`;

    const configs = new Configuration({
      inputPages: parsedInputPages,
      outputPage: parsedOutputPage,
      formulaList: parsedFormulaList,
    });

    try {
      const savedConfigs = await configs.save();

      response.status(201).json(savedConfigs);
    } catch (error) {
      console.log(error);
    }
  }
);

module.exports = configurationsRouter;
