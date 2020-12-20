import { Button, TextField, Typography } from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Router from 'next/router';
import { useStyles } from '../utils/styles';
import CheckoutSteps from '../components/CheckoutSteps';
import { Store } from '../components/Store';
import { CART_SET_SHIPPING } from '../utils/constants';
import dynamic from 'next/dynamic';

function Shipping() {
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    if (!userInfo) {
      Router.push('/signin');
    }
  }, []);
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');

  const classes = useStyles();
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch({
      type: CART_SET_SHIPPING,
      payload: {
        fullName,
        address,
        city,
        postalCode,
        country,
      },
    });
    Router.push('/payment');
  };

  return (
    <Layout title="Shipping Address">
      <CheckoutSteps activeStep={1}></CheckoutSteps>

      <form className={classes.form} onSubmit={submitHandler}>
        <Typography component="h1" variant="h1">
          Shipping Address
        </Typography>
        <TextField
          margin="normal"
          variant="outlined"
          required
          fullWidth
          label="Address"
          name="address"
          onChange={(e) => setAddress(e.target.value)}
        />
        <TextField
          margin="normal"
          variant="outlined"
          required
          fullWidth
          label="City"
          name="city"
          onChange={(e) => setCity(e.target.value)}
        />
        <TextField
          margin="normal"
          variant="outlined"
          required
          fullWidth
          label="Postal Code"
          name="postalCode"
          onChange={(e) => setPostalCode(e.target.value)}
        />
        <TextField
          margin="normal"
          variant="outlined"
          required
          fullWidth
          label="Country"
          name="country"
          onChange={(e) => setCountry(e.target.value)}
        />
        <TextField
          margin="normal"
          variant="outlined"
          required
          fullWidth
          label="Full Name"
          name="fullName"
          onChange={(e) => setFullName(e.target.value)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          Continue
        </Button>
      </form>
    </Layout>
  );
}
export default dynamic(() => Promise.resolve(Shipping), {
  ssr: false,
});
