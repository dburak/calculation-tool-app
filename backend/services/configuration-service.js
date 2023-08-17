const Configuration = require('../models/configuration');
const config = require('../utils/config');
const fs = require('fs');
const path = require('path');

getConfigurations = async () => {
  const configs = await Configuration.findOne({});
  return configs;
};

createOrUpdateConfiguration = async (
  inputPages,
  outputPage,
  formulaList,
  imageFiles,
  imageIndexArray
) => {
  let existingConfig = await Configuration.findOne();

  const parsedInputPages = JSON.parse(inputPages);
  const parsedOutputPage = JSON.parse(outputPage);
  const parsedFormulaList = JSON.parse(formulaList);

  const cleanedImageIndexArray = imageIndexArray.filter(
    (index) => index !== 'undefined'
  );

  if (!existingConfig) {
    const lastIndex = imageFiles.length - 1;

    for (let index = 0; index < lastIndex; index++) {
      const file = imageFiles[index];
      const imagePath = file.path;
      parsedInputPages[index].image = `${config.HOST_URL}/${imagePath}`;
    }

    const lastFile = imageFiles[lastIndex];
    const lastImagePath = lastFile.path;
    parsedOutputPage.image = `${config.HOST_URL}/${lastImagePath}`;

    existingConfig = new Configuration({
      inputPages: parsedInputPages,
      outputPage: parsedOutputPage,
      formulaList: parsedFormulaList,
    });
  } else {
    cleanedImageIndexArray.forEach((imageIndex, arrayIndex) => {
      const file = imageFiles[arrayIndex];
      if (file) {
        if (imageIndex === 'outputImage') {
          const lastImagePath = file.path;
          parsedOutputPage.image = `${config.HOST_URL}/${lastImagePath}`;
        } else {
          const inputPageIndex = parseInt(imageIndex.split(' ')[1]);
          const imagePath = file.path;
          parsedInputPages[
            inputPageIndex
          ].image = `${config.HOST_URL}/${imagePath}`;
        }
      }
    });

    existingConfig.inputPages = parsedInputPages;
    existingConfig.outputPage = parsedOutputPage;
    existingConfig.formulaList = parsedFormulaList;
  }

  const savedConfigs = await existingConfig.save();
  return savedConfigs;
};

const directoryPath = path.join(__dirname, '../uploads/images');

deleteConfiguration = async () => {
  try {
    const deletedConfig = await Configuration.findOneAndDelete();
    if (!deletedConfig) {
      throw new Error('No configuration found to delete');
    }
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        console.error('An Error Occured:', err);
        return;
      }

      files.forEach((file) => {
        const filePath = path.join(directoryPath, file);
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(`An Error Occured: ${file}`, err);
          } else {
            console.log(`Image deleted: ${file}`);
          }
        });
      });
    });

    return deletedConfig;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getConfigurations,
  createOrUpdateConfiguration,
  deleteConfiguration,
};
