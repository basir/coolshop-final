import { Alert } from '@material-ui/lab';
import {
  Button,
  CircularProgress,
  Slide,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import React, { useContext, useEffect } from 'react';
import Layout from '../../../components/Layout';
import Router from 'next/router';
import { Store } from '../../../components/Store';
import dynamic from 'next/dynamic';
import Axios from 'axios';
import { getResponseError } from '../../../utils/error';
import Link from 'next/link';

function reducer(state, action) {
  switch (action.type) {
    case 'PRODUCT_LIST_REQUEST':
      return { ...state, loading: true };
    case 'PRODUCT_LIST_SUCCESS':
      return { ...state, loading: false, products: action.payload };
    case 'PRODUCT_LIST_FAIL':
      return { ...state, loading: false, error: action.payload };

    case 'PRODUCT_DELETE_REQUEST':
      return { ...state, loadingDelete: true };
    case 'PRODUCT_DELETE_SUCCESS':
      return { ...state, loadingDelete: false, successDelete: true };
    case 'PRODUCT_DELETE_FAIL':
      return { ...state, loadingDelete: false, errorDelete: action.payload };
    case 'PRODUCT_DELETE_RESET':
      return {
        ...state,
        loadingDelete: false,
        successDelete: false,
        errorDelete: '',
      };
    default:
      return state;
  }
}

function Products() {
  const [
    { loading, error, products, loadingDelete, errorDelete, successDelete },
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
    const fecthProducts = async () => {
      dispatch({ type: 'PRODUCT_LIST_REQUEST' });
      try {
        const { data } = await Axios.get(`/api/products`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'PRODUCT_LIST_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'PRODUCT_LIST_FAIL',
          payload: getResponseError(err),
        });
      }
    };
    fecthProducts();
  }, [successDelete]);

  const deleteProductHandler = async (product) => {
    if (!window.confirm('Are you sure to delete?')) {
      return;
    }
    dispatch({ type: 'PRODUCT_DELETE_REQUEST' });
    try {
      const { data } = await Axios.delete(`/api/products/${product._id}`, {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });
      dispatch({ type: 'PRODUCT_DELETE_SUCCESS', payload: data });
    } catch (error) {
      dispatch({
        type: 'PRODUCT_DELETE_FAIL',
        payload: getResponseError(error),
      });
    }
  };

  const createProductHandler = async () => {
    dispatch({ type: 'PRODUCT_CREATE_REQUEST' });
    try {
      const { data } = await Axios.post(
        `/api/products`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'PRODUCT_CREATE_SUCCESS', payload: data });
      Router.push(`/admin/products/${data.product._id}`);
    } catch (error) {
      dispatch({
        type: 'PRODUCT_CREATE_FAIL',
        payload: getResponseError(error),
      });
    }
  };

  return (
    <Layout title="Admin Products">
      {loading ? (
        <CircularProgress></CircularProgress>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <React.Fragment>
          <Typography component="h1" variant="h1">
            Admin Products
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => createProductHandler()}
          >
            New Product
          </Button>
          {errorDelete && <Alert severity="error">{errorDelete}</Alert>}
          {loadingDelete && <CircularProgress />}
          {successDelete && (
            <Alert severity="success">Product deleted successfully</Alert>
          )}

          <Slide direction="up" in={true}>
            <TableContainer>
              <Table aria-label="Products">
                <TableHead>
                  <TableRow>
                    <TableCell>Id</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell component="th" scope="row">
                        ...{product._id.substring(20, 24)}
                      </TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell align="right">${product.price}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>
                        <Link href={`/admin/products/${product._id}`}>
                          <Button>Edit</Button>
                        </Link>
                        <Button onClick={() => deleteProductHandler(product)}>
                          Delete
                        </Button>
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

export default dynamic(() => Promise.resolve(Products), {
  ssr: false,
});
