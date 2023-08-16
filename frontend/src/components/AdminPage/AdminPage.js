import React, { useState } from 'react';
import { Button, TextField, Container, Typography, Grid } from '@mui/material';
import Inputs from './Inputs';
import Output from './Output';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

import { useDispatch } from 'react-redux';
import { setReduxConfig } from '../../reducers/configurationReducer';

const AdminPage = () => {
  const [inputPages, setInputPages] = useState([]);
  const [outputPage, setOutputPage] = useState({});
  const [formula, setFormula] = useState('');
  const [formulaList, setFormulaList] = useState([]);

  const dispatch = useDispatch();

  const handleAddInputPage = () => {
    setInputPages([
      ...inputPages,
      {
        title: '',
        description: '',
        inputValues: [{ placeholder: '', variable: '' }],
        image: null,
      },
    ]);
    setOutputPage({
      title: '',
      description: '',
      outputValues: [{ placeholder: '', variable: '' }],
      outputUnit: '',
      image: null,
    });
  };

  const handleRemoveInputPage = () => {
    if (inputPages.length > 0) {
      setInputPages(inputPages.slice(0, -1));
    }
  };

  const handleInputChange = (
    pageIndex,
    title,
    description,
    inputValues,
    pickedFile
  ) => {
    const updatedInputPages = [...inputPages];
    updatedInputPages[pageIndex] = {
      title,
      description,
      inputValues,
      image: pickedFile,
    };
    setInputPages(updatedInputPages);
  };

  const handleOutputChange = (
    title,
    description,
    outputValues,
    outputUnit,
    pickedFile
  ) => {
    setOutputPage({
      title,
      description,
      outputValues,
      outputUnit,
      image: pickedFile,
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

  const handleSave = async () => {
    dispatch(setReduxConfig(inputPages, outputPage, formulaList));
  };

  return (
    <Container>
      <Typography
        mt={2}
        variant='h4'
        component='h1'
        align='center'
        gutterBottom
      >
        Welcome to Configuration Page!
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Button
            startIcon={<AddIcon />}
            variant='contained'
            fullWidth
            onClick={handleAddInputPage}
          >
            Add Page
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            startIcon={<DeleteIcon />}
            variant='contained'
            fullWidth
            onClick={handleRemoveInputPage}
            color='secondary'
          >
            Remove Page
          </Button>
        </Grid>
      </Grid>
      <div style={{ marginTop: '20px' }}>
        {inputPages.map((inputPage, index) => (
          <div key={index} style={{ margin: '64px 0' }}>
            <Typography variant='h4' component='h2' gutterBottom align='center'>
              Input Page {index + 1}
            </Typography>
            <Inputs
              index={index}
              title={inputPage.title}
              description={inputPage.description}
              inputValues={inputPage.inputValues}
              image={inputPage.image}
              fileIsValid={inputPage.fileIsValid}
              onInputChange={handleInputChange}
            />
          </div>
        ))}
        {inputPages.length > 0 && (
          <div>
            <Typography variant='h4' component='h2' gutterBottom align='center'>
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
            <Typography variant='h5' style={{ marginTop: '24px' }}>
              Formula
            </Typography>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: '16px',
                marginBottom: '16px',
              }}
            >
              <TextField
                variant='outlined'
                size='small'
                fullWidth
                value={formula}
                onChange={({ target }) => setFormula(target.value)}
              />
              <Button
                startIcon={<AddIcon />}
                variant='contained'
                size='medium'
                onClick={handleAddFormula}
                style={{ marginLeft: '10px' }}
              >
                ADD
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
                <Typography variant='subtitle2' style={{ marginRight: '10px' }}>
                  Output {index + 1}:
                </Typography>
                <div style={{ flex: 1 }}>
                  <TextField
                    variant='outlined'
                    size='small'
                    fullWidth
                    value={formula}
                    readOnly
                  />
                </div>
                <Button
                  startIcon={<DeleteIcon />}
                  variant='contained'
                  size='medium'
                  onClick={() => handleRemoveFormula(index)}
                  style={{ marginLeft: '10px' }}
                  color='secondary'
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}
        {inputPages.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <Button
              variant='contained'
              color='primary'
              fullWidth
              style={{ marginTop: '20px' }}
              onClick={handleSave}
            >
              SAVE
            </Button>
          </div>
        )}
      </div>
    </Container>
  );
};

export default AdminPage;
