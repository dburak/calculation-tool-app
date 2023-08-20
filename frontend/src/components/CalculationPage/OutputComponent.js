import React from 'react';
import { Box, Typography } from '@mui/material';
import ContactBox from './ContactBox';

const OutputComponent = ({ outputPage, calculatedValues }) => {
  return (
    <>
      <Box mt={2}>
        <Typography variant='h4'>{outputPage.title}</Typography>
        <Typography mt={2} variant='body1'>
          {outputPage.description}
        </Typography>
        <Box mt={2}>
          {outputPage.outputValues.map((outputValue) => (
            <Box key={outputValue._id} mt={4}>
              <Typography key={outputValue._id} variant='body1' component='p'>
                <strong>{outputValue.placeholder}</strong>:{' '}
                {calculatedValues[outputValue.variable.toLowerCase()]}{' '}
                {outputPage.outputUnit}
              </Typography>
            </Box>
          ))}
          <ContactBox />
        </Box>
      </Box>
    </>
  );
};

export default OutputComponent;
