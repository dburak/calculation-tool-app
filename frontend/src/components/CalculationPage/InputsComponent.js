import React from 'react';
import { Box, Typography, TextField } from '@mui/material';

const PageComponent = ({ page, inputValues, onInputChange }) => {
  return (
    <Box mt={2}>
      <Typography variant='h4'>{page.title}</Typography>
      <Typography mt={2} variant='body1'>
        {page.description}
      </Typography>
      <Box mt={4}>
        {page.inputValues.map((inputValue) => (
          <Box key={inputValue.id} mb={2}>
            <TextField
              type='number'
              label={inputValue.placeholder}
              value={inputValues[inputValue.variable] || ''}
              onChange={({ target }) => {
                const newValue = Math.max(0, parseFloat(target.value));
                onInputChange(inputValue.variable, newValue.toString());
              }}
              variant='outlined'
              fullWidth
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default PageComponent;
