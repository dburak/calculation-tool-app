import React, { useState } from 'react';
import {
  Box,
  Modal,
  TextField,
  IconButton,
  Typography,
  Button,
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { MuiTelInput } from 'mui-tel-input';

import customerService from '../../services/customer';

const ContactBox = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [showNameError, setShowNameError] = useState(false);
  const [showSurnameError, setShowSurnameError] = useState(false);
  const [showPhoneError, setShowPhoneError] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setName('');
    setSurname('');
    setPhoneNumber('');
    setShowSuccessMessage(false);
  };

  const handleSendButton = () => {
    if (!name) {
      setShowNameError(true);
    } else {
      setShowNameError(false);
    }

    if (!surname) {
      setShowSurnameError(true);
    } else {
      setShowSurnameError(false);
    }

    if (phoneNumber.replace(/\D/g, '').length !== 12) {
      setShowPhoneError(true);
    } else {
      setShowPhoneError(false);
    }

    if (name && surname && phoneNumber.replace(/\D/g, '').length === 12) {
      customerService
        .sendCustomer({ name, surname, phoneNumber })
        .then(() => setShowSuccessMessage(true));
    }
  };

  return (
    <Box
      sx={{
        marginTop: 15,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: 215,
        marginLeft: 'auto',
      }}
    >
      <Box
        sx={{
          boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.4)',
          padding: '10px',
          borderRadius: '5px',
          backgroundColor: 'white',
          marginBottom: '10px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
        onClick={handleModalOpen}
      >
        <Typography variant='body1'>Contact Us for a Callback !</Typography>
      </Box>
      <PhoneIcon
        sx={{
          width: 50,
          height: 50,
          color: '#075e54',
          transform: 'rotate(275deg)',
        }}
      />
      {modalOpen && (
        <Modal open={modalOpen} onClose={handleModalClose}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              minWidth: 300,
              maxWidth: '80%',
              bgcolor: 'white',
              p: 5,
              borderRadius: 2,
            }}
          >
            {showSuccessMessage ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CheckCircleIcon
                  sx={{
                    color: '#4CAF50',
                    fontSize: 100,
                  }}
                />
                <Typography variant='body1' align='center' mt={4} mb={6}>
                  We've received your information. Thank you!
                </Typography>
                <Button
                  variant='contained'
                  fullWidth
                  onClick={handleModalClose}
                  style={{ marginTop: '20px' }}
                >
                  Close
                </Button>
              </div>
            ) : (
              <>
                <Typography variant='h4' align='center' mb={4}>
                  Contact Us
                </Typography>
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    zIndex: 1,
                  }}
                  onClick={handleModalClose}
                >
                  <CloseIcon />
                </IconButton>
                <TextField
                  type='text'
                  required
                  label='Name'
                  fullWidth
                  sx={{
                    mb: 2,
                    '& .MuiFormLabel-asterisk': { color: '#FF0000' },
                  }}
                  value={name}
                  onChange={({ target }) => setName(target.value)}
                  error={showNameError}
                  helperText={showNameError ? 'Please enter your name.' : ''}
                />
                <TextField
                  type='text'
                  required
                  label='Surname'
                  fullWidth
                  sx={{
                    mb: 2,
                    '& .MuiFormLabel-asterisk': { color: '#FF0000' },
                  }}
                  value={surname}
                  onChange={({ target }) => setSurname(target.value)}
                  error={showSurnameError}
                  helperText={
                    showSurnameError ? 'Please enter your surname.' : ''
                  }
                />
                <MuiTelInput
                  type='tel'
                  required
                  label='Phone'
                  sx={{
                    mb: 2,
                    '& .MuiFormLabel-asterisk': { color: '#FF0000' },
                  }}
                  defaultCountry='TR'
                  placeholder='(5xx) xxx xx xx'
                  disableDropdown
                  forceCallingCode
                  value={phoneNumber}
                  onChange={(value) => {
                    setPhoneNumber(value);
                  }}
                  flagSize='medium'
                  fullWidth
                  error={showPhoneError}
                  helperText={
                    showPhoneError
                      ? 'Please enter a 10-digit phone number.'
                      : ''
                  }
                />
                <Button
                  variant='contained'
                  color='primary'
                  onClick={handleSendButton}
                  sx={{
                    mt: 2,
                  }}
                  fullWidth
                >
                  Send
                </Button>
              </>
            )}
          </Box>
        </Modal>
      )}
    </Box>
  );
};

export default ContactBox;
