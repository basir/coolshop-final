import { Alert } from '@material-ui/lab';
import {
  Box,
  Button,
  CircularProgress,
  Slide,
  TextField,
  Typography,
} from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import Layout from '../../../components/Layout';
import Router from 'next/router';
import { useStyles } from '../../../utils/styles';
import { Store } from '../../../components/Store';
import dynamic from 'next/dynamic';
import Axios from 'axios';
import { getResponseError } from '../../../utils/error';

function reducer(state, action) {
  switch (action.type) {
    case 'PRODUCT_DETAILS_REQUEST':
      return { ...state, loading: true };
    case 'PRODUCT_DETAILS_SUCCESS':
      return { ...state, loading: false, product: action.payload };
    case 'PRODUCT_DETAILS_FAIL':
      return { ...state, loading: false, error: action.payload };

    case 'PRODUCT_UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'PRODUCT_UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false, successUpdate: true };
    case 'PRODUCT_UPDATE_FAIL':
      return { ...state, loadingUpdate: false, errorUpdate: action.payload };
    case 'PRODUCT_UPDATE_RESET':
      return {
        ...state,
        loadingUpdate: false,
        successUpdate: false,
        errorUpdate: '',
      };

    default:
      return state;
  }
}

function Product({ params }) {
  const classes = useStyles();
  const productId = params.id;

  const [
    { loading, error, product, loadingUpdate, errorUpdate, successUpdate },
    dispatch,
  ] = React.useReducer(reducer, {
    loading: true,
    loadingUpdate: false,
    successUpdate: false,
    errorUpdate: '',
  });

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(0);
  const [countInStock, setCountInStock] = useState(0);

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    if (!userInfo) {
      return Router.push('/signin');
    }
    const fecthProduct = async () => {
      dispatch({ type: 'PRODUCT_DETAILS_REQUEST' });
      try {
        const { data } = await Axios.get(`/api/products/${productId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'PRODUCT_DETAILS_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'PRODUCT_DETAILS_FAIL',
          payload: getResponseError(err),
        });
      }
    };
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setCategory(product.category);
      setBrand(product.brand);
      setCountInStock(product.countInStock);
      setImage(product.image);
      setDescription(product.description);
    } else {
      fecthProduct();
    }
  }, [product]);

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch({ type: 'PRODUCT_UPDATE_REQUEST' });
    try {
      const { data } = await Axios.put(
        `/api/products/${product._id}`,
        { name, price, category, brand, image, countInStock, description },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'PRODUCT_UPDATE_SUCCESS', payload: data });
      Router.push('/admin/products');
    } catch (error) {
      dispatch({
        type: 'PRODUCT_UPDATE_FAIL',
        payload: getResponseError(error),
      });
    }
  };

  return (
    <Layout title="Edit Product">
      {loading ? (
        <CircularProgress></CircularProgress>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <React.Fragment>
          <Slide direction="up" in={true}>
            <form className={classes.form} onSubmit={submitHandler}>
              <Typography component="h1" variant="h1">
                Edit Product ...{product._id.substring(20, 24)}
              </Typography>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Name"
                name="name"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Price"
                name="price"
                value={price}
                type="number"
                onChange={(e) => setPrice(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Image"
                name="image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Category"
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Brand"
                name="brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />

              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Count in stock"
                name="countInStock"
                value={countInStock}
                type="number"
                onChange={(e) => setCountInStock(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Description"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Update
              </Button>
              <Box>
                {loadingUpdate && <CircularProgress></CircularProgress>}
                {errorUpdate && <Alert severity="error">{errorUpdate}</Alert>}
                {successUpdate && (
                  <Alert severity="success">
                    Profile updated successfully.
                  </Alert>
                )}
              </Box>
            </form>
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

export default dynamic(() => Promise.resolve(Product), {
  ssr: false,
});
