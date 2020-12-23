import { calcCartSummary } from '../utils';
import { PayPalButton } from 'react-paypal-button-v2';
import Cookies from 'js-cookie';

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
import Layout from '../components/Layout';
import Router from 'next/router';
import { useStyles } from '../utils/styles';
import { Store } from '../components/Store';
import dynamic from 'next/dynamic';
import Axios from 'axios';
import { getResponseError } from '../utils/error';
import Link from 'next/link';

function reducer(state, action) {
  switch (action.type) {
    case 'ORDER_HISTORY_REQUEST':
      return { ...state, loading: true };
    case 'ORDER_HISTORY_SUCCESS':
      return { ...state, loading: false, orders: action.payload };
    case 'ORDER_HISTORY_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

function Order() {
  const classes = useStyles();

  const [
    { loading, error, orders, loadingDelete, errorDelete, successDelete },
    dispatch,
  ] = React.useReducer(reducer, {
    loading: true,
    loadingDelete: false,
    successDelete: false,
    errorDelete: '',
  });

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    if (!userInfo) {
      return Router.push('/signin');
    }
    const fecthOrders = async () => {
      dispatch({ type: 'ORDER_HISTORY_REQUEST' });
      try {
        const { data } = await Axios.get(`/api/orders/history`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'ORDER_HISTORY_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'ORDER_HISTORY_FAIL',
          payload: getResponseError(err),
        });
      }
    };

    fecthOrders();
    dispatch({ type: 'ORDER_DELETE_RESET' });
  }, []);

  const deleteOrderHandler = async (order) => {
    dispatch({ type: 'ORDER_DELETE_REQUEST' });
    try {
      const { data } = await Axios.put(`/api/orders/${order._id}/delete`, {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });
      dispatch({ type: 'ORDER_DELETE_SUCCESS', payload: data });
    } catch (error) {
      dispatch({ type: 'ORDER_DELETE_FAIL', payload: getResponseError(error) });
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
            Orders
          </Typography>
          <Slide direction="up" in={true}>
            <TableContainer>
              <Table aria-label="Orders">
                <TableHead>
                  <TableRow>
                    <TableCell>Id</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell>Paid</TableCell>
                    <TableCell>Delivered</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell component="th" scope="row">
                        ...{order._id.substring(20, 24)}
                      </TableCell>
                      <TableCell>{order.createdAt.substring(0, 10)}</TableCell>
                      <TableCell align="right">${order.totalPrice}</TableCell>
                      <TableCell>
                        {order.isPaid ? order.paidAt.substring(0, 10) : 'No'}
                      </TableCell>
                      <TableCell>
                        {order.isDelivered
                          ? order.deliveredAt.substring(0, 10)
                          : 'No'}
                      </TableCell>
                      <TableCell>
                        <Link href={`/orders/${order._id}`}>
                          <Button>Details</Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Slide>
        </React.Fragment>
      )}
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(Order), {
  ssr: false,
});
