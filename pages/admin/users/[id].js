import { Alert } from '@material-ui/lab';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
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
    case 'USER_DETAILS_REQUEST':
      return { ...state, loading: true };
    case 'USER_DETAILS_SUCCESS':
      return { ...state, loading: false, user: action.payload };
    case 'USER_DETAILS_FAIL':
      return { ...state, loading: false, error: action.payload };

    case 'USER_UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'USER_UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false, successUpdate: true };
    case 'USER_UPDATE_FAIL':
      return { ...state, loadingUpdate: false, errorUpdate: action.payload };
    case 'USER_UPDATE_RESET':
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

function User({ params }) {
  const classes = useStyles();
  const userId = params.id;

  const [
    { loading, error, user, loadingUpdate, errorUpdate, successUpdate },
    dispatch,
  ] = React.useReducer(reducer, {
    loading: true,
    loadingUpdate: false,
    successUpdate: false,
    errorUpdate: '',
  });

  const [name, setName] = useState('');
  const [email, setEmail] = useState(0);
  const [isAdmin, setIsAdmin] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    if (!userInfo) {
      return Router.push('/signin');
    }
    const fecthUser = async () => {
      dispatch({ type: 'USER_DETAILS_REQUEST' });
      try {
        const { data } = await Axios.get(`/api/users/${userId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'USER_DETAILS_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'USER_DETAILS_FAIL',
          payload: getResponseError(err),
        });
      }
    };
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    } else {
      fecthUser();
    }
  }, [user]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (confirmPassword !== password) {
      return dispatch({
        type: 'USER_UPDATE_FAIL',
        payload: 'Passwords are not matched',
      });
    }
    dispatch({ type: 'USER_UPDATE_REQUEST' });
    try {
      const { data } = await Axios.put(
        `/api/users/${user._id}`,
        {
          name,
          email,
          isAdmin,
          password,
        },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'USER_UPDATE_SUCCESS', payload: data });
      Router.push('/admin/users');
    } catch (error) {
      dispatch({
        type: 'USER_UPDATE_FAIL',
        payload: getResponseError(error),
      });
    }
  };

  return (
    <Layout title="Edit User">
      {loading ? (
        <CircularProgress></CircularProgress>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <React.Fragment>
          <Slide direction="up" in={true}>
            <form className={classes.form} onSubmit={submitHandler}>
              <Typography component="h1" variant="h1">
                Edit User ...{user._id.substring(20, 24)}
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
                label="Email"
                name="email"
                value={email}
                type="email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    value="admin"
                    checked={isAdmin}
                    onChange={(e) => setIsAdmin(e.target.checked)}
                    color="primary"
                  />
                }
                label="Is Admin"
              />

              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                label="Password"
                name="password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />

              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                  <Alert severity="success">User updated successfully.</Alert>
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

export default dynamic(() => Promise.resolve(User), {
  ssr: false,
});
