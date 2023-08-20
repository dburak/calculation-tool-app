import React, { useState, useEffect } from 'react';
import {
  Button,
  Container,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PhoneIcon from '@mui/icons-material/Phone';

import customerService from '../../services/customer';

import { useDispatch } from 'react-redux';
import AlertBox from '../shared/AlertBox';
import { setReduxAlert } from '../../reducers/alertReducer';

const Customers = () => {
  const dispatch = useDispatch();
  const [customers, setCustomers] = useState([]);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [hoveredCustomerId, setHoveredCustomerId] = useState(null);

  useEffect(() => {
    customerService.getCustomers().then((res) => setCustomers(res));
  }, []);

  const handleRowMouseEnter = (customerId) => {
    setHoveredCustomerId(customerId);
  };

  const handleRowMouseLeave = () => {
    setHoveredCustomerId(null);
  };

  const handleCheckboxChange = (customerId) => {
    setSelectedCustomers((prevSelectedCustomers) => {
      if (prevSelectedCustomers.includes(customerId)) {
        return prevSelectedCustomers.filter((id) => id !== customerId);
      } else {
        return [...prevSelectedCustomers, customerId];
      }
    });
  };

  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(customers.map((customer) => customer.id));
    }
    setSelectAll(!selectAll);
  };

  const handleDeleteSelected = () => {
    customerService
      .deleteCustomer({ data: selectedCustomers })
      .then((deletedCustomer) => {
        dispatch(
          setReduxAlert(
            {
              message: `${deletedCustomer.message}`,
              type: 'success',
            },
            5
          )
        );
      })
      .then(() => {
        setCustomers((prevCustomers) =>
          prevCustomers.filter(
            (customer) => !selectedCustomers.includes(customer.id)
          )
        );

        setSelectedCustomers([]);
      })
      .catch((error) => {
        console.log('An error occurred while deleting customers:', error);
      });
  };

  return (
    <Container>
      <Typography
        mt={2}
        variant='h4'
        component='h1'
        align='center'
        gutterBottom
      >
        Customers
      </Typography>
      <Grid container justifyContent='center'>
        <Grid item xs={12} md={8}>
          <div
            style={{
              height: '40px',
              display: 'flex',
              justifyContent: 'flex-end',
              marginBottom: "8px"
            }}
          >
            {selectedCustomers.length > 0 && (
              <Button
                startIcon={<DeleteIcon />}
                variant='contained'
                size='medium'
                color='secondary'
                onClick={handleDeleteSelected}
              >
                Delete
              </Button>
            )}
          </div>
          <div>
            <TableContainer
              component={Paper}
              elevation={4}
              sx={{ borderRadius: 2 }}
            >
              <Table>
                <TableHead style={{ backgroundColor: '#87848e' }}>
                  <TableRow>
                    <TableCell>
                      <Checkbox
                        checked={selectAll}
                        onChange={handleSelectAllChange}
                      />
                    </TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Surname</TableCell>
                    <TableCell>Phone Number</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow
                      key={customer.id}
                      onMouseEnter={() => handleRowMouseEnter(customer.id)}
                      onMouseLeave={handleRowMouseLeave}
                      style={{
                        backgroundColor: selectedCustomers.includes(customer.id)
                          ? '#ffc8c8'
                          : hoveredCustomerId === customer.id
                          ? '#d7d6d9'
                          : 'inherit',
                      }}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedCustomers.includes(customer.id)}
                          onChange={() => handleCheckboxChange(customer.id)}
                        />
                      </TableCell>
                      <TableCell>{customer.name}</TableCell>
                      <TableCell>{customer.surname}</TableCell>
                      <TableCell
                        sx={{ display: { xs: 'none', md: 'table-cell' } }}
                      >
                        {customer.phoneNumber}
                      </TableCell>
                      <TableCell>
                        <a
                          href={`tel:${customer.phoneNumber}`}
                          style={{ textDecoration: 'none', color: 'green' }}
                        >
                          <Button
                            fullWidth
                            variant='outlined'
                            startIcon={<PhoneIcon />}
                            style={{
                              borderColor: 'green',
                              color: 'green',
                            }}
                          >
                            Call
                          </Button>
                        </a>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Grid>
      </Grid>
      <AlertBox />
    </Container>
  );
};

export default Customers;
