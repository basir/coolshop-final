import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import Cookies from 'js-cookie';
import Axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Router from 'next/router';
import { getResponseError } from '../utils/error';
import { useStyles } from '../utils/styles';
import { Store } from '../components/Store';
import { USER_SIGN_IN } from '../utils/constants';
import dynamic from 'next/dynamic';

function Profile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    if (!userInfo) {
      Router.push('/signin');
    } else {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
  }, []);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const classes = useStyles();
  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (password !== confirmPassword) {
        setLoading(false);
        setError('Passwords are not matched');
        return;
      }
      const { data } = await Axios.put(
        '/api/users/profile',
        {
          name,
          email,
          password,
        },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: USER_SIGN_IN, payload: data });
      Cookies.set('userInfo', data);
      setSuccess(true);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(getResponseError(err));
    }
  };

  return (
    <Layout title="Profile">
      <form className={classes.form} onSubmit={submitHandler}>
        <Typography component="h1" variant="h1">
          Profile
        </Typography>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="name"
          label="Name"
          name="name"
          autoComplete="name"
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          name="password"
          label="Confirm Password"
          type="password"
          id="confirmPassword"
          autoComplete="current-password"
          value={confirmPassword}
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
          {loading && <CircularProgress></CircularProgress>}
          {error && <Alert severity="error">{error}</Alert>}
          {success && (
            <Alert severity="success">Profile updated successfully.</Alert>
          )}
        </Box>
      </form>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(Profile), {
  ssr: false,
});
