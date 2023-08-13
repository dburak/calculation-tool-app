import React, { useState } from 'react';
import { Button, TextField, Container, Typography, Grid } from '@mui/material';
import Inputs from './Inputs';
import Output from './Output';

const AdminPage = () => {
  const [inputPages, setInputPages] = useState([]);
  const [outputPage, setOutputPage] = useState({});
  const [formula, setFormula] = useState('');
  const [formulaList, setFormulaList] = useState([]);

  const handleAddInputPage = () => {
    setInputPages([
      ...inputPages,
      {
        title: '',
        description: '',
        inputValues: [{ placeholder: '', variable: '' }],
      },
    ]);
    setOutputPage({
      title: '',
      description: '',
      outputValues: [{ placeholder: '', variable: '' }],
      outputUnit: '',
    });
  };

  const handleRemoveInputPage = () => {
    if (inputPages.length > 0) {
      setInputPages(inputPages.slice(0, -1));
    }
  };

  const handleInputChange = (pageIndex, title, description, inputValues) => {
    const updatedInputPages = [...inputPages];
    updatedInputPages[pageIndex] = { title, description, inputValues };
    setInputPages(updatedInputPages);
  };

  const handleOutputChange = (title, description, outputValues, outputUnit) => {
    setOutputPage({
      title,
      description,
      outputValues,
      outputUnit,
    });
  };

  const handleAddFormula = () => {
    setFormulaList([...formulaList, formula]);
    setFormula('');
  };

  const handleRemoveFormula = (index) => {
    const updatedFormulaList = formulaList.filter((_, i) => i !== index);
    setFormulaList(updatedFormulaList);
  };

  return (
    <Container>
      <Typography variant='h4' component='h1' align='center' gutterBottom>
        Welcome to Configuration Page!
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Button variant='contained' fullWidth onClick={handleAddInputPage}>
            Add Page
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button variant='contained' fullWidth onClick={handleRemoveInputPage}>
            Remove Page
          </Button>
        </Grid>
      </Grid>
      <div style={{ marginTop: '20px' }}>
        {inputPages.map((inputPage, index) => (
          <div key={index} style={{ marginBottom: '20px' }}>
            <Typography variant='h5' component='h2' gutterBottom>
              Input Page {index + 1}
            </Typography>
            <Inputs
              index={index}
              title={inputPage.title}
              description={inputPage.description}
              inputValues={inputPage.inputValues}
              onInputChange={handleInputChange}
            />
          </div>
        ))}
        {inputPages.length > 0 && (
          <div>
            <Typography variant='h5' component='h2' gutterBottom>
              Output Page
            </Typography>
            <Output
              title={outputPage.title}
              description={outputPage.description}
              outputValues={outputPage.outputValues}
              outputUnit={outputPage.outputUnit}
              onOutputChange={handleOutputChange}
            />
          </div>
        )}
        {inputPages.length > 0 && (
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: '10px',
              }}
            >
              <Typography style={{ marginRight: '10px' }}>
                New Formula:
              </Typography>
              <TextField
                variant='outlined'
                size='small'
                fullWidth
                value={formula}
                onChange={({ target }) => setFormula(target.value)}
              />
              <Button
                variant='contained'
                size='small'
                onClick={handleAddFormula}
                style={{ marginLeft: '10px' }}
              >
                Add
              </Button>
            </div>
            {formulaList.map((formula, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginTop: '10px',
                }}
              >
                <Typography style={{ marginRight: '10px' }}>
                  Formula {index + 1}:
                </Typography>
                <TextField
                  variant='outlined'
                  size='small'
                  fullWidth
                  value={formula}
                  readOnly
                />
                <Button
                  variant='contained'
                  size='small'
                  onClick={() => handleRemoveFormula(index)}
                  style={{ marginLeft: '10px' }}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}
        <div style={{ marginBottom: '20px' }}></div>
      </div>
    </Container>
  );
};

export default AdminPage;
