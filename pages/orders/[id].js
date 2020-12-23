import { PayPalButton } from 'react-paypal-button-v2';

import { Alert } from '@material-ui/lab';
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Grid,
  List,
  ListItem,
  Slide,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import Router from 'next/router';
import { useStyles } from '../../utils/styles';
import { Store } from '../../components/Store';
import dynamic from 'next/dynamic';
import Axios from 'axios';
import { getResponseError } from '../../utils/error';

function reducer(state, action) {
  switch (action.type) {
    case 'ORDER_DETAILS_REQUEST':
      return { ...state, loading: true };
    case 'ORDER_DETAILS_SUCCESS':
      return { ...state, loading: false, order: action.payload };
    case 'ORDER_DETAILS_FAIL':
      return { ...state, loading: false, error: action.payload };

    case 'ORDER_PAY_REQUEST':
      return { ...state, loadingPay: true };
    case 'ORDER_PAY_SUCCESS':
      return { ...state, loadingPay: false, successPay: true };
    case 'ORDER_PAY_FAIL':
      return { ...state, loadingPay: false, errorPay: action.payload };
    case 'ORDER_PAY_RESET':
      return { ...state, loadingPay: false, successPay: false, errorPay: '' };

    case 'ORDER_DELIVER_REQUEST':
      return { ...state, loadingDeliver: true };
    case 'ORDER_DELIVER_SUCCESS':
      return { ...state, loadingDeliver: false, successDeliver: true };
    case 'ORDER_DELIVER_FAIL':
      return { ...state, loadingDeliver: false, errorDeliver: action.payload };
    case 'ORDER_DELIVER_RESET':
      return {
        ...state,
        loadingDeliver: false,
        successDeliver: false,
        errorDeliver: '',
      };
    default:
      return state;
  }
}

function Order({ params }) {
  const classes = useStyles();
  const orderId = params.id;

  const [sdkReady, setSdkReady] = useState(false);
  const [
    {
      loading,
      error,
      order,
      loadingPay,
      errorPay,
      successPay,
      loadingDeliver,
      errorDeliver,
      successDeliver,
    },
    dispatch,
  ] = React.useReducer(reducer, {
    loading: true,
    loadingPay: false,
    successPay: false,
    errorPay: '',
    loadingDeliver: false,
    successDeliver: false,
    errorDeliver: '',
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
        const { data } = await Axios.get(`/api/orders/${orderId}`, {
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
    const addPayPalScript = async () => {
      const { data } = await Axios.get('/api/keys/paypal', {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://www.paypal.com/sdk/js?client-id=${data}`;
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };
    if (
      !order ||
      successPay ||
      successDeliver ||
      (order && order._id !== orderId)
    ) {
      fecthOrder();
      dispatch({ type: 'ORDER_PAY_RESET' });
      dispatch({ type: 'ORDER_DELIVER_RESET' });
    } else {
      if (!order.isPaid) {
        if (!window.paypal) {
          addPayPalScript();
        } else {
          setSdkReady(true);
        }
      }
    }
  }, [order, successPay, successDeliver]);

  const payOrderHandler = async (paymentResult) => {
    dispatch({ type: 'ORDER_PAY_REQUEST' });
    try {
      const { data } = await Axios.put(
        `/api/orders/${order._id}/pay`,
        paymentResult,
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'ORDER_PAY_SUCCESS', payload: data });
    } catch (error) {
      dispatch({ type: 'ORDER_PAY_FAIL', payload: getResponseError(error) });
    }
  };
  const deliverOrderHandler = async () => {
    dispatch({ type: 'ORDER_DELIVER_REQUEST' });
    try {
      const { data } = await Axios.put(
        `/api/orders/${order._id}/deliver`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'ORDER_DELIVER_SUCCESS', payload: data });
    } catch (error) {
      dispatch({
        type: 'ORDER_DELIVER_FAIL',
        payload: getResponseError(error),
      });
    }
  };

  return (
    <Layout title="Order Details">
      {loading ? (
        <CircularProgress></CircularProgress>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <React.Fragment>
          <Typography component="h1" variant="h1">
            Order ...{order._id.substring(20, 24)}
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

                <Card className={classes.mt1}>
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
                <Card className={[classes.mt1, classes.p1]}>
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
              <Grid item md={3} xs={12}>
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
                    {!order.isPaid && (
                      <ListItem>
                        {!sdkReady ? (
                          <CircularProgress />
                        ) : (
                          <Box className={classes.fullWidth}>
                            {errorPay && (
                              <Alert severity="error">{errorPay}</Alert>
                            )}
                            {loadingPay && <CircularProgress />}

                            <PayPalButton
                              amount={order.totalPrice}
                              onSuccess={payOrderHandler}
                            ></PayPalButton>
                          </Box>
                        )}
                      </ListItem>
                    )}
                    {userInfo &&
                      userInfo.isAdmin &&
                      order.isPaid &&
                      !order.isDelivered && (
                        <ListItem>
                          {errorDeliver && (
                            <Alert severity="error">{errorDeliver}</Alert>
                          )}
                          {loadingDeliver && <CircularProgress />}
                          <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={deliverOrderHandler}
                          >
                            Deliver Order
                          </Button>
                        </ListItem>
                      )}
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
