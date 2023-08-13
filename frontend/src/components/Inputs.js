import React from 'react';
import { Button, TextField, Typography, Box } from '@mui/material';

const Inputs = ({ index, title, description, inputValues, onInputChange }) => {
  const handleAddInput = () => {
    const newInput = { placeholder: '', variable: '' };
    const newInputValues = [...inputValues, newInput];
    onInputChange(index, title, description, newInputValues);
  };

  const handleRemoveInput = (localIndex) => {
    if (inputValues.length > 1) {
      const newInputValues = [...inputValues];
      newInputValues.splice(localIndex, 1);
      onInputChange(index, title, description, newInputValues);
    }
  };

  const handleLocalInputChange = (localIndex, field, value) => {
    const newInputValues = [...inputValues];
    newInputValues[localIndex][field] = value;
    onInputChange(index, title, description, newInputValues);
  };

  return (
    <Box>
      <Typography variant='subtitle2' gutterBottom>
        Title
      </Typography>
      <TextField
        variant='outlined'
        size='small'
        fullWidth
        value={title}
        onChange={(e) =>
          onInputChange(index, e.target.value, description, inputValues)
        }
      />
      <Typography variant='subtitle2' gutterBottom>
        Description
      </Typography>
      <TextField
        variant='outlined'
        size='small'
        fullWidth
        value={description}
        onChange={(e) =>
          onInputChange(index, title, e.target.value, inputValues)
        }
      />
      <Box mt={2}>
        <Button variant='contained' size='small' onClick={handleAddInput}>
          Add Input
        </Button>
      </Box>
      {inputValues.map((input, localIndex) => (
        <Box key={localIndex} mt={2}>
          <Typography variant='subtitle2'>Placeholder:</Typography>
          <TextField
            variant='outlined'
            size='small'
            fullWidth
            value={input.placeholder}
            onChange={(e) =>
              handleLocalInputChange(localIndex, 'placeholder', e.target.value)
            }
          />
          <Typography variant='subtitle2'>Variable:</Typography>
          <TextField
            variant='outlined'
            size='small'
            fullWidth
            value={input.variable}
            onChange={(e) =>
              handleLocalInputChange(localIndex, 'variable', e.target.value)
            }
          />
          <Button
            variant='contained'
            size='small'
            onClick={() => handleRemoveInput(localIndex)}
          >
            Remove Input
          </Button>
        </Box>
      ))}
    </Box>
  );
};

export default Inputs;
