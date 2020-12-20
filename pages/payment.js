import {
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Router from 'next/router';
import { useStyles } from '../utils/styles';
import CheckoutSteps from '../components/CheckoutSteps';
import { Store } from '../components/Store';
import { CART_SET_PAYMENT, CART_SET_SHIPPING } from '../utils/constants';
import dynamic from 'next/dynamic';

function Payemnt() {
  const { state, dispatch } = useContext(Store);
  const { shippingAddress } = state.cart;

  useEffect(() => {
    if (!shippingAddress.address) {
      Router.push('/shipping');
    }
  }, []);
  const [paymentMethod, setPaymentMethod] = useState('');

  const classes = useStyles();
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch({
      type: CART_SET_PAYMENT,
      payload: paymentMethod,
    });
    Router.push('/place-order');
  };

  return (
    <Layout title="Payment Method">
      <CheckoutSteps activeStep={2}></CheckoutSteps>

      <form className={classes.form} onSubmit={submitHandler}>
        <Typography component="h1" variant="h1">
          Payment Method
        </Typography>
        <FormControl component="fieldset">
          <RadioGroup
            aria-label="Payment Method"
            name="paymentMethod"
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <FormControlLabel
              value="PayPal"
              control={<Radio />}
              label="PayPal"
            />
            <FormControlLabel
              value="Stripe"
              control={<Radio />}
              label="Stripe"
            />
            <FormControlLabel
              disabled
              value="Cash"
              control={<Radio />}
              label="Cash"
            />
          </RadioGroup>
        </FormControl>
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
export default dynamic(() => Promise.resolve(Payemnt), {
  ssr: false,
});
