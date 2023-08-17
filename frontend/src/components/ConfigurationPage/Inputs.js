import React from 'react';
import { Button, TextField, Typography, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import AlertBox from '../shared/AlertBox';

import ImageUpload from '../shared/ImageUpload';

const Inputs = ({
  index,
  title,
  description,
  inputValues,
  onInputChange,
  image,
}) => {
  const handleAddInput = () => {
    const newInput = { placeholder: '', variable: '' };
    const newInputValues = [...inputValues, newInput];
    onInputChange(index, title, description, newInputValues, image);
  };

  const handleRemoveInput = (localIndex) => {
    if (inputValues.length > 1) {
      const newInputValues = [...inputValues];
      newInputValues.splice(localIndex, 1);
      onInputChange(index, title, description, newInputValues, image);
    }
  };

  const handleLocalInputChange = (localIndex, field, value) => {
    const newInputValues = [...inputValues];
    newInputValues[localIndex] = {
      ...newInputValues[localIndex],
      [field]: value,
    };

    onInputChange(index, title, description, newInputValues, image);
  };

  const handleImageInput = (image) => {
    onInputChange(index, title, description, inputValues, {
      image,
      index: `inputIndex ${index}`,
    });
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
          onInputChange(index, e.target.value, description, inputValues, image)
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
          onInputChange(index, title, e.target.value, inputValues, image)
        }
      />
      <ImageUpload onInputChange={handleImageInput} image={image} />
      <Box mt={2}>
        <Button
          startIcon={<AddIcon />}
          variant='contained'
          size='medium'
          onClick={handleAddInput}
          fullWidth
        >
          Add Input
        </Button>
      </Box>
      {inputValues.map((input, localIndex) => (
        <Box key={localIndex} mt={2}>
          <Typography variant='subtitle2'>
            {localIndex + 1}. Placeholder:
          </Typography>
          <TextField
            variant='outlined'
            size='small'
            fullWidth
            value={input.placeholder}
            onChange={(e) =>
              handleLocalInputChange(localIndex, 'placeholder', e.target.value)
            }
          />
          <Typography variant='subtitle2'>
            {localIndex + 1}. Variable:
          </Typography>
          <TextField
            variant='outlined'
            size='small'
            fullWidth
            value={input.variable}
            onChange={(e) =>
              handleLocalInputChange(localIndex, 'variable', e.target.value)
            }
          />
          {inputValues.length > 1 && (
            <Box display='flex' alignItems='center' mt={1}>
              <Button
                startIcon={<DeleteIcon />}
                variant='contained'
                size='medium'
                color='secondary'
                onClick={() => handleRemoveInput(localIndex)}
              >
                Remove Input
              </Button>
            </Box>
          )}
        </Box>
      ))}
      <AlertBox />
    </Box>
  );
};

export default Inputs;
