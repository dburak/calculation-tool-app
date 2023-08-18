import React from 'react';
import { Button, TextField, Typography, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ImageUpload from '../shared/ImageUpload';

const Output = ({
  title,
  description,
  outputValues,
  image,
  outputUnit,
  onOutputChange,
}) => {
  const handleAddOutput = () => {
    const newOutput = { placeholder: '', variable: '' };
    const newOutputValues = [...outputValues, newOutput];
    onOutputChange(title, description, newOutputValues, outputUnit, image);
  };

  const handleRemoveOutput = (localIndex) => {
    if (outputValues.length > 1) {
      const newOutputValues = [...outputValues];
      newOutputValues.splice(localIndex, 1);
      onOutputChange(title, description, newOutputValues, outputUnit, image);
    }
  };

  const handleLocalOutputChange = (localIndex, field, value) => {
    const newOutputValues = [...outputValues];
    newOutputValues[localIndex] = {
      ...newOutputValues[localIndex],
      [field]: value,
    };
    onOutputChange(title, description, newOutputValues, outputUnit, image);
  };

  const handleImageInput = (image) => {
    onOutputChange(title, description, outputValues, outputUnit, {
      image,
      index: `outputImage`,
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
          onOutputChange(
            e.target.value,
            description,
            outputValues,
            outputUnit,
            image
          )
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
          onOutputChange(title, e.target.value, outputValues, outputUnit, image)
        }
      />
      <ImageUpload onInputChange={handleImageInput} image={image} />
      <Box mt={2}>
        <Button
          startIcon={<AddIcon />}
          variant='contained'
          size='medium'
          onClick={handleAddOutput}
          fullWidth
        >
          Add Output
        </Button>
      </Box>
      {outputValues.map((output, localIndex) => (
        <Box key={localIndex} mt={2}>
          <Typography variant='subtitle2'>
            {localIndex + 1}. Placeholder:
          </Typography>
          <TextField
            variant='outlined'
            size='small'
            fullWidth
            value={output.placeholder}
            onChange={(e) =>
              handleLocalOutputChange(localIndex, 'placeholder', e.target.value)
            }
          />
          <Typography variant='subtitle2'>
            {localIndex + 1}. Variable:
          </Typography>
          <TextField
            variant='outlined'
            size='small'
            fullWidth
            value={output.variable}
            onChange={(e) =>
              handleLocalOutputChange(localIndex, 'variable', e.target.value)
            }
          />
          {outputValues.length > 1 && (
            <Box display='flex' alignItems='center' mt={1}>
              <Button
                startIcon={<DeleteIcon />}
                variant='contained'
                size='medium'
                color='secondary'
                onClick={() => handleRemoveOutput(localIndex)}
              >
                Remove Output
              </Button>
            </Box>
          )}
        </Box>
      ))}
      <Box mt={2}>
        <Typography variant='subtitle2'>Output Unit:</Typography>
        <TextField
          variant='outlined'
          size='small'
          fullWidth
          value={outputUnit}
          onChange={(e) =>
            onOutputChange(
              title,
              description,
              outputValues,
              e.target.value,
              image
            )
          }
        />
      </Box>
    </Box>
  );
};

export default Output;
