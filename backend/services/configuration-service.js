const Configuration = require('../models/configuration');
const config = require('../utils/config');

getConfigurations = async () => {
  const configs = await Configuration.find({});
  return configs[0];
};

createConfiguration = async (
  inputPages,
  outputPage,
  formulaList,
  imageFiles
) => {
  const parsedInputPages = JSON.parse(inputPages);
  const parsedOutputPage = JSON.parse(outputPage);
  const parsedFormulaList = JSON.parse(formulaList);

  const lastIndex = imageFiles.length - 1;

  for (let index = 0; index < lastIndex; index++) {
    const file = imageFiles[index];
    const imagePath = file.path;
    parsedInputPages[index].image = `${config.HOST_URL}/${imagePath}`;
  }

  const lastFile = imageFiles[lastIndex];
  const lastImagePath = lastFile.path;
  parsedOutputPage.image = `${config.HOST_URL}/${lastImagePath}`;

  const configs = new Configuration({
    inputPages: parsedInputPages,
    outputPage: parsedOutputPage,
    formulaList: parsedFormulaList,
  });

  const savedConfigs = await configs.save();
  return savedConfigs;
};

module.exports = {
  getConfigurations,
  createConfiguration,
};
