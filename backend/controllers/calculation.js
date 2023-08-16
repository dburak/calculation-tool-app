const calculationRouter = require('express').Router();
const math = require('mathjs');

calculationRouter.post('/', async (request, response) => {
  const { formulaList, inputValues } = request.body;
  const results = {};

  const evaluatedValues = {};

  Object.keys(inputValues).forEach((key) => {
    const inputFormula = inputValues[key];
    try {
      const inputResult = math.evaluate(inputFormula, evaluatedValues);
      evaluatedValues[key] = inputResult;
    } catch (error) {
      console.error(error);
      evaluatedValues[key] = 'Calculation Error';
    }
  });

  formulaList.forEach((formula) => {
    const [formulaKey, formulaExpression] = formula
      .split('=')
      .map((str) => str.trim());
    try {
      const modifiedFormula = formulaExpression.replace(
        /\b([A-Za-z_][A-Za-z_0-9]*)\b/g,
        (match, variable) =>
          evaluatedValues[variable] !== undefined
            ? evaluatedValues[variable]
            : match
      );

      const formulaResult = math.evaluate(modifiedFormula, evaluatedValues);
      evaluatedValues[formulaKey] = formulaResult;
      results[formulaKey] = formulaResult;
    } catch (error) {
      console.error(error);
      results[formulaKey] = 'Calculation Error';
    }
  });

  response.json(results);
});

module.exports = calculationRouter;
