import React, { useState, useEffect } from 'react';
import { Button, TextField, Container, Typography, Grid } from '@mui/material';
import Inputs from './Inputs';
import Output from './Output';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditNoteIcon from '@mui/icons-material/EditNote';
import AlertBox from '../shared/AlertBox';
import LoadingSpinner from '../shared/LoadingSpinner';

import { useDispatch, useSelector } from 'react-redux';
import {
  saveReduxConfig,
  getReduxConfig,
  removeReduxConfig,
} from '../../reducers/configurationReducer';
import { setReduxAlert } from '../../reducers/alertReducer';

const ConfigurationPage = () => {
  const [inputPages, setInputPages] = useState([]);
  const [outputPage, setOutputPage] = useState({});
  const [formula, setFormula] = useState('');
  const [formulaList, setFormulaList] = useState([]);
  const [showInputs, setShowInputs] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();
  const configs = useSelector((state) => state.configuration);

  useEffect(() => {
    dispatch(getReduxConfig()).then(() => setIsLoading(false));
  }, [dispatch]);

  useEffect(() => {
    if (configs) {
      setInputPages(configs.inputPages);
      setOutputPage(configs.outputPage);
      setFormulaList(configs.formulaList);
    }
  }, [configs]);

  const callEmptyOutputPage = () => {
    setOutputPage({
      title: '',
      description: '',
      outputValues: [{ placeholder: '', variable: '' }],
      outputUnit: '',
      image: null,
    });
    setFormulaList([]);
  };

  const handleAddInputPage = () => {
    setShowInputs(true);
    setInputPages([
      ...inputPages,
      {
        title: '',
        description: '',
        inputValues: [{ placeholder: '', variable: '' }],
        image: null,
      },
    ]);
    if (Object.keys(outputPage).length < 1) {
      callEmptyOutputPage();
    }
  };

  const handleRemoveInputPage = () => {
    setInputPages(inputPages.slice(0, -1));
    if (inputPages.length === 1) {
      setShowInputs(false);
      callEmptyOutputPage();
      if (configs) {
        handleDelete();
      }
    }
  };

  const handleInputChange = (
    pageIndex,
    title,
    description,
    inputValues,
    image
  ) => {
    const updatedInputPages = [...inputPages];
    updatedInputPages[pageIndex] = {
      title,
      description,
      inputValues,
      image,
    };
    setInputPages(updatedInputPages);
  };

  const handleOutputChange = (
    title,
    description,
    outputValues,
    outputUnit,
    image
  ) => {
    setOutputPage({
      title,
      description,
      outputValues,
      outputUnit,
      image,
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

  const handleSave = () => {
    setIsLoading(true);
    dispatch(saveReduxConfig(inputPages, outputPage, formulaList))
      .then(() => {
        dispatch(getReduxConfig())
          .then(() => {
            setShowInputs(false);
            dispatch(
              setReduxAlert(
                {
                  message: 'Your configuration has been successfully saved.',
                  type: 'success',
                },
                4
              )
            );
          })
          .catch((error) => {})
          .finally(() => {
            setIsLoading(false);
          });
      })
      .catch((error) => {
        dispatch(
          setReduxAlert(
            {
              message: 'Please check your inputs.',
              type: 'error',
            },
            4
          )
        ).finally(() => {
          setIsLoading(false);
        });
      });
  };

  const handleDelete = () => {
    dispatch(removeReduxConfig())
      .then(() => {
        dispatch(
          setReduxAlert(
            {
              message:
                'Your configuration and images has been successfully removed.',
              type: 'success',
            },
            4
          )
        );
        setInputPages([]);
        setOutputPage({});
        setFormulaList([]);
      })
      .catch((error) => {
        dispatch(
          setReduxAlert(
            {
              message: 'An error occurred, please try again.',
              type: 'error',
            },
            4
          )
        );
      });
  };

  return (
    <Container>
      <Container>{isLoading && <LoadingSpinner />}</Container>
      <Typography
        mt={2}
        variant='h4'
        component='h1'
        align='center'
        gutterBottom
      >
        Welcome to Configuration Page !
      </Typography>

      {configs && !showInputs ? (
        <>
          <Button
            startIcon={<EditNoteIcon />}
            variant='contained'
            fullWidth
            onClick={() => setShowInputs(true)}
            style={{ marginTop: '20px' }}
          >
            Update Configuration
          </Button>
          <Button
            startIcon={<DeleteIcon />}
            variant='contained'
            fullWidth
            color='secondary'
            style={{ marginTop: '10px' }}
            onClick={handleDelete}
          >
            Remove Configuration
          </Button>
        </>
      ) : (
        <>
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
                disabled={!showInputs}
                color='secondary'
              >
                Remove Page
              </Button>
            </Grid>
          </Grid>
        </>
      )}
      {showInputs && (
        <div style={{ marginTop: '20px' }}>
          {inputPages.map((inputPage, index) => (
            <div key={index} style={{ margin: '64px 0' }}>
              <Typography
                variant='h4'
                component='h2'
                gutterBottom
                align='center'
              >
                Input Page {index + 1}
              </Typography>
              <Inputs
                index={index}
                title={inputPage.title}
                description={inputPage.description}
                inputValues={inputPage.inputValues}
                image={inputPage.image}
                onInputChange={handleInputChange}
              />
            </div>
          ))}
          {inputPages.length > 0 && (
            <div>
              <Typography
                variant='h4'
                component='h2'
                gutterBottom
                align='center'
              >
                Output Page
              </Typography>
              <Output
                title={outputPage.title}
                description={outputPage.description}
                image={outputPage.image}
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
                  <Typography
                    variant='subtitle2'
                    style={{ marginRight: '10px' }}
                  >
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
          {inputPages.length > 0 && !configs ? (
            <div style={{ marginBottom: '20px' }}>
              <Button
                variant='contained'
                color='primary'
                fullWidth
                style={{ marginTop: '20px' }}
                disabled={!formulaList.length}
                onClick={handleSave}
              >
                SAVE
              </Button>
            </div>
          ) : (
            <div style={{ marginBottom: '20px' }}>
              <Button
                variant='contained'
                color='primary'
                fullWidth
                style={{ marginTop: '20px' }}
                onClick={handleSave}
                disabled={!formulaList.length}
              >
                UPDATE
              </Button>
            </div>
          )}
        </div>
      )}
      <AlertBox />
    </Container>
  );
};

export default ConfigurationPage;
