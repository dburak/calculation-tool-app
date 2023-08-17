import React, { useRef, useState, useEffect } from 'react';
import { Button, Box } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const ImageUpload = ({ onInputChange, image }) => {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();

  const filePickerRef = useRef();

  useEffect(() => {
    if (!file) {
      if (image) {
        setPreviewUrl(image);
      } else {
        setPreviewUrl(null);
      }
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file, image]);

  const handlePick = ({ target }) => {
    let pickedFile;

    if (target.files && target.files.length === 1) {
      pickedFile = target.files[0];
      setFile(pickedFile);
    } else {
      console.log('Image Upload Error');
    }
    onInputChange(pickedFile);
  };

  const handleImageUpload = () => {
    filePickerRef.current.click();
  };

  return (
    <Box mt={2}>
      <Box mt={2}>
        {previewUrl ? (
          <img src={previewUrl} alt='Preview' width={160} />
        ) : (
          <p>Please pick an image.</p>
        )}
      </Box>
      <Button
        startIcon={<CloudUploadIcon />}
        variant='contained'
        component='label'
        onClick={handleImageUpload}
      >
        Image Upload
      </Button>
      <input
        ref={filePickerRef}
        accept='image/*'
        hidden
        type='file'
        onChange={handlePick}
      />
    </Box>
  );
};

export default ImageUpload;
