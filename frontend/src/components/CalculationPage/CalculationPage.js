import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getReduxConfig } from '../../reducers/configurationReducer';
import { Box, Button, Container, LinearProgress } from '@mui/material';
import PageComponent from './PageComponent';
import OutputComponent from './OutputComponent';
import calculationService from '../../services/calculation';

const CalculationPage = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [inputValues, setInputValues] = useState({});
  const [calculatedValues, setCalculatedValues] = useState({});

  const dispatch = useDispatch();
  const configs = useSelector((state) => state.configuration);
  const { inputPages, outputPage, formulaList } = configs || {
    inputPages: [],
    outputPage: null,
    formulaList: [],
  };

  useEffect(() => {
    dispatch(getReduxConfig());
  }, [dispatch]);

  useEffect(() => {
    if (currentPage === inputPages.length) {
      calculationService
        .sendCalculation({ formulaList, inputValues })
        .then((res) => setCalculatedValues(res));
    }
  }, [currentPage, inputPages.length, formulaList, inputValues]);

  const handleNext = () => {
    if (currentPage < inputPages.length) {
      setCurrentPage(currentPage + 1);
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

  if (!configs) {
    return <div>Loading...</div>;
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
            style={{ maxWidth: '100%', minHeight: '97%', borderRadius: '4px' }}
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
          <PageComponent
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
    </Container>
  );
};

export default CalculationPage;
