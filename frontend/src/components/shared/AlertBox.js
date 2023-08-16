import React from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';
import { useSelector } from 'react-redux';

const AlertBox = () => {
  const alert = useSelector((state) => state.alert);

  if (!alert) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '90%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <Stack>
        {alert.type === 'success' ? (
          <Alert severity='success'>
            <AlertTitle>Success</AlertTitle>
            {alert.message}
          </Alert>
        ) : alert.type === 'error' ? (
          <Alert severity='error'>
            <AlertTitle>Error</AlertTitle>
            {alert.message}
          </Alert>
        ) : null}
      </Stack>
    </div>
  );
};

export default AlertBox;
