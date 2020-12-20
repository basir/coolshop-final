import { calcCartSummary } from '../../utils';
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
import Layout from '../../components/Layout';
import Router from 'next/router';
import { useStyles } from '../../utils/styles';
import CheckoutSteps from '../../components/CheckoutSteps';
import { Store } from '../../components/Store';
import { CART_CLEAR } from '../../utils/constants';
import dynamic from 'next/dynamic';
import Axios from 'axios';
import { getResponseError } from '../../utils/error';

function reducer(state, action) {
  switch (action.type) {
    case 'ORDER_DETAILS_REQUEST':
      return { loading: true };
    case 'ORDER_DETAILS_SUCCESS':
      return { order: action.payload };
    case 'ORDER_DETAILS_FAIL':
      return { error: action.payload };
    default:
      return state;
  }
}

function Order({ params }) {
  const classes = useStyles();

  const [{ loading, error, order }, dispatch] = React.useReducer(reducer, {
    loading: true,
  });

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    if (!userInfo) {
      return Router.push('/signin');
    }
    const fecthOrder = async () => {
      dispatch({ type: 'ORDER_DETAILS_REQUEST' });
      try {
        const { data } = await Axios.get('/api/orders/' + params.id, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'ORDER_DETAILS_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'ORDER_DETAILS_FAIL',
          payload: getResponseError(err),
        });
      }
    };
    fecthOrder();
  }, []);

  const payOrderHandler = async (e) => {
    e.preventDefault();

    try {
      const { data } = await Axios.put(
        '/api/orders',
        {},
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      Router.push('/orders/' + data.order._id);
    } catch (err) {
      // setLoading(false);
      // setError(getResponseError(err));
    }
  };

  return (
    <Layout title="Place Order">
      {loading ? (
        <CircularProgress></CircularProgress>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <React.Fragment>
          <Typography component="h1" variant="h1">
            Order {order._id}
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
                      {order.shippingAddress.fullName} -{' '}
                      {order.shippingAddress.address},
                      {order.shippingAddress.city},{' '}
                      {order.shippingAddress.postalCode},
                      {order.shippingAddress.country}
                    </ListItem>
                    <ListItem>
                      {order.isDelivered ? (
                        <Alert severity="success">
                          Delivered at {order.deliveredAt}
                        </Alert>
                      ) : (
                        <Alert severity="error">Not delivered</Alert>
                      )}
                    </ListItem>
                  </List>
                </Card>

                <Card className={classes.marginTop}>
                  <List>
                    <ListItem>
                      <Typography variant="h2">Payment Method</Typography>
                    </ListItem>
                    <ListItem>{order.paymentMethod}</ListItem>
                    <ListItem>
                      {order.isPaid ? (
                        <Alert severity="success">Paid at {order.paidAt}</Alert>
                      ) : (
                        <Alert severity="error">Not paid</Alert>
                      )}
                    </ListItem>
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
                          {order.orderItems.map((orderItems) => (
                            <TableRow key={orderItems.name}>
                              <TableCell component="th" scope="row">
                                <img
                                  className={classes.smallImage}
                                  alt={orderItems.name}
                                  src={orderItems.image}
                                ></img>
                                {orderItems.name}
                              </TableCell>
                              <TableCell align="right">
                                {orderItems.quantity}
                              </TableCell>
                              <TableCell align="right">
                                {orderItems.price}
                              </TableCell>
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
                          <Typography align="right">
                            ${order.itemsPrice}
                          </Typography>
                        </Grid>
                      </Grid>
                    </ListItem>
                    <ListItem>
                      <Grid container>
                        <Grid item xs={6}>
                          Shipping
                        </Grid>
                        <Grid item xs={6}>
                          <Typography align="right">
                            ${order.shippingPrice}
                          </Typography>
                        </Grid>
                      </Grid>
                    </ListItem>
                    <ListItem>
                      <Grid container>
                        <Grid item xs={6}>
                          Tax
                        </Grid>
                        <Grid item xs={6}>
                          <Typography align="right">
                            ${order.taxPrice}
                          </Typography>
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
                            ${order.totalPrice}
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
                        onClick={payOrderHandler}
                      >
                        Pay Order
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
        </React.Fragment>
      )}
    </Layout>
  );
}
export async function getServerSideProps({ params }) {
  return {
    props: { params },
  };
}

export default dynamic(() => Promise.resolve(Order), {
  ssr: false,
});
