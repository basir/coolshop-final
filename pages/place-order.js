import { calcCartSummary } from '../utils';
import Cookies from 'js-cookie';

import { Alert } from '@material-ui/lab';
import {
  Button,
  Card,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Slide,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Router from 'next/router';
import { useStyles } from '../utils/styles';
import CheckoutSteps from '../components/CheckoutSteps';
import { Store } from '../components/Store';
import { CART_CLEAR } from '../utils/constants';
import dynamic from 'next/dynamic';
import Axios from 'axios';
import { getResponseError } from '../utils/error';

function PlaceOrder() {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { state, dispatch } = useContext(Store);
  const { userInfo, cart } = state;
  const { cartItems, paymentMethod, shippingAddress } = cart;

  const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calcCartSummary(
    cartItems
  );

  useEffect(() => {
    if (!paymentMethod || !userInfo) {
      Router.push('/payment');
    }
  }, []);

  const placeOrderHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await Axios.post(
        '/api/orders',
        {
          ...cart,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({
        type: CART_CLEAR,
      });
      Cookies.remove('cartItems');
      Router.push('/orders/' + data.order._id);
    } catch (err) {
      setLoading(false);
      setError(getResponseError(err));
    }
  };

  return (
    <Layout title="Place Order">
      <CheckoutSteps activeStep={3}></CheckoutSteps>

      <Typography component="h1" variant="h1">
        Place Order
      </Typography>

      <Slide direction="up" in={true}>
        <Grid container spacing={1}>
          <Grid item md={9}>
            <Card>
              <List>
                <ListItem>
                  <Typography variant="h2">Shipping Address</Typography>
                </ListItem>
                <ListItem>
                  {shippingAddress.fullName} - {shippingAddress.address},
                  {shippingAddress.city}, {shippingAddress.postalCode},
                  {shippingAddress.country}
                </ListItem>
              </List>
            </Card>

            <Card className={classes.marginTop}>
              <List>
                <ListItem>
                  <Typography variant="h2">Payment Method</Typography>
                </ListItem>
                <ListItem>{paymentMethod}</ListItem>
              </List>
            </Card>
            <Card className={[classes.marginTop, classes.space]}>
              <Typography variant="h2">Order Items</Typography>
              <Grid container>
                <TableContainer>
                  <Table aria-label="Orders">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Price</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {cartItems.map((cartItem) => (
                        <TableRow key={cartItem.name}>
                          <TableCell component="th" scope="row">
                            <img
                              className={classes.smallImage}
                              alt={cartItem.name}
                              src={cartItem.image}
                            ></img>
                            {cartItem.name}
                          </TableCell>
                          <TableCell align="right">
                            {cartItem.quantity}
                          </TableCell>
                          <TableCell align="right">{cartItem.price}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Card>
          </Grid>
          <Grid item md={3}>
            <Card>
              <List>
                <ListItem>
                  <Typography variant="h2">Order Summary</Typography>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      Items
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right">${itemsPrice}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      Shipping
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right">${shippingPrice}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      Tax
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right">${taxPrice}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography variant="h2">Total</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="h2" align="right">
                        ${totalPrice}
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={placeOrderHandler}
                  >
                    Place Order
                  </Button>
                </ListItem>
                <ListItem>
                  {loading && <CircularProgress></CircularProgress>}
                  {error && <Alert severity="error">{error}</Alert>}
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      </Slide>
    </Layout>
  );
}
export default dynamic(() => Promise.resolve(PlaceOrder), {
  ssr: false,
});
