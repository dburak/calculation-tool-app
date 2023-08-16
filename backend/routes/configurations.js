const configurationsRouter = require('express').Router();
const configurationService = require('../services/configuration-service');

const authCheck = require('../middleware/auth-check');
const fileUpload = require('../middleware/file-upload');

configurationsRouter.get('/', async (request, response) => {
  try {
    const configs = await configurationService.getConfigurations();
    response.json(configs);
  } catch (error) {
    response.status(500).json({ error: 'Internal Server Error' });
  }
});

configurationsRouter.post(
  '/',
  authCheck.tokenExtractor,
  authCheck.userExtractor,
  fileUpload.array('image'),
  async (request, response) => {
    try {
      const { inputPages, outputPage, formulaList } = request.body;
      const imageFiles = request.files;

      const savedConfigs = await configurationService.createConfiguration(
        inputPages,
        outputPage,
        formulaList,
        imageFiles
      );

      response.status(201).json(savedConfigs);
    } catch (error) {
      response.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

module.exports = configurationsRouter;
