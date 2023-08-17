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

// Since there will always be only one record in the database, there is no need to use both the POST and PUT methods here.
// If there are no records, the PUT method performs a creation; if a record exists, it performs an update.
// Therefore, we can use the PUT method to both create and update purpose.
configurationsRouter.put(
  '/',
  // authCheck.tokenExtractor,
  // authCheck.userExtractor,
  fileUpload.array('image'),
  async (request, response) => {
    try {
      const { inputPages, outputPage, formulaList, imageIndexArray } =
        request.body;
      const imageFiles = request.files;

      const savedConfigs =
        await configurationService.createOrUpdateConfiguration(
          inputPages,
          outputPage,
          formulaList,
          imageFiles,
          imageIndexArray
        );

      response.status(201).json(savedConfigs);
    } catch (error) {
      response.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

// Since there will always be only one record in the database, there is no need to provide an id parametre here.
configurationsRouter.delete('/', async (request, response) => {
  try {
    await configurationService.deleteConfiguration();

    response.status(204).json({ message: 'Configuration deleted.' });
  } catch (error) {
    response.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = configurationsRouter;
