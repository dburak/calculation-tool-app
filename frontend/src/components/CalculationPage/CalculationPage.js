import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Button,
  Container,
  LinearProgress,
  Typography,
  CircularProgress,
} from '@mui/material';
import InputsComponent from './InputsComponent';
import OutputComponent from './OutputComponent';
import AlertBox from '../shared/AlertBox';

import { getReduxConfig } from '../../reducers/configurationReducer';
import { setReduxAlert } from '../../reducers/alertReducer';
import calculationService from '../../services/calculation';

const CalculationPage = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [inputValues, setInputValues] = useState({});
  const [calculatedValues, setCalculatedValues] = useState({});
  const [isLoadingConfigs, setIsLoadingConfigs] = useState(true);

  const dispatch = useDispatch();
  const configs = useSelector((state) => state.configuration);

  const { inputPages, outputPage, formulaList } = configs || {
    inputPages: [],
    outputPage: null,
    formulaList: [],
  };

  useEffect(() => {
    dispatch(getReduxConfig())
      .then(() => setIsLoadingConfigs(false))
      .catch(() => setIsLoadingConfigs(false));
  }, [dispatch]);

  useEffect(() => {
    if (currentPage === inputPages.length && inputPages.length > 0) {
      calculationService
        .sendCalculation({ formulaList, inputValues })
        .then((res) => setCalculatedValues(res));
    }
  }, [currentPage, inputPages.length, formulaList, inputValues]);

  const handleNext = () => {
    if (currentPage < inputPages.length) {
      const currentPageInputs = inputPages[currentPage].inputValues;
      const hasEmptyOrNaNInput = currentPageInputs.some((input) => {
        const inputValue = inputValues[input.variable];
        return inputValue === '' || isNaN(inputValue);
      });

      if (!hasEmptyOrNaNInput) {
        setCurrentPage(currentPage + 1);
      } else {
        dispatch(
          setReduxAlert(
            {
              message: 'Please fill in all required fields with valid numbers.',
              type: 'error',
            },
            4
          )
        );
      }
    }
  };

  const handleBack = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleInputChange = (variable, value) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [variable]: value,
    }));
  };

  if (isLoadingConfigs) {
    return (
      <Box
        display='flex'
        alignItems='center'
        justifyContent='center'
        minHeight='90vh'
        minWidth='100vw'
        padding='24px'
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!configs) {
    return (
      <Container
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '90vh',
          minWidth: '100vw',
          padding: '24px',
        }}
      >
        <Typography variant='h5'>
          No Calculation Tool has been loaded yet.
        </Typography>
      </Container>
    );
  }

  const isLastPage = currentPage === inputPages.length;

  return (
    <Container
      style={{
        display: 'grid',
        gridTemplateColumns: '1.5fr 1fr',
        minHeight: '90vh',
        minWidth: '100vw',
        padding: '24px',
      }}
    >
      <Box
        mt={2}
        mb={2}
        style={{
          padding: '0 64px',
        }}
      >
        <LinearProgress
          variant='determinate'
          value={(currentPage / inputPages.length) * 100}
          style={{
            height: '8px',
            borderRadius: '16px',
            marginBottom: '16px',
            marginTop: '6px',
          }}
        />
        {!isLastPage ? (
          <img
            src={inputPages[currentPage].image}
            alt={`Page ${currentPage + 1}`}
            style={{ maxWidth: '90%', minHeight: '90%', borderRadius: '4px' }}
          />
        ) : (
          <img
            src={outputPage.image}
            alt={`Page ${currentPage + 1}`}
            style={{ maxWidth: '100%', minHeight: '97%', borderRadius: '4px' }}
          />
        )}
      </Box>

      <Box
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '0 32px',
        }}
      >
        {isLastPage ? (
          <OutputComponent
            outputPage={outputPage}
            calculatedValues={calculatedValues}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
          />
        ) : (
          <InputsComponent
            page={inputPages[currentPage]}
            inputValues={inputValues}
            onInputChange={handleInputChange}
          />
        )}

        <Box
          display='flex'
          justifyContent='space-between'
          padding='15px'
          backgroundColor='#fff'
          borderTop='1px solid #ccc'
        >
          <Button
            variant='contained'
            onClick={handleBack}
            disabled={currentPage === 0}
          >
            BACK
          </Button>
          <Button
            variant='contained'
            color='primary'
            onClick={handleNext}
            disabled={currentPage === inputPages.length}
          >
            NEXT
          </Button>
        </Box>
      </Box>
      <AlertBox />
    </Container>
  );
};

export default CalculationPage;
