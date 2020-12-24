import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import Cookies from 'js-cookie';
import Axios from 'axios';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Router, { useRouter } from 'next/router';
import { getResponseError } from '../utils/error';
import { useStyles } from '../utils/styles';
import { Store } from '../components/Store';
import { USER_SIGN_IN } from '../utils/constants';
import dynamic from 'next/dynamic';

function Signin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { query } = router;
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    if (userInfo) {
      Router.push(query.redirect || '/');
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
        setError('Passwords are not matched');
        return;
      }
      const { data } = await Axios.post('/api/users/signup', {
        name,
        email,
        password,
      });
      dispatch({ type: USER_SIGN_IN, payload: data });
      Cookies.set('userInfo', data);
      Router.push(query.redirect || '/');
    } catch (err) {
      setLoading(false);
      setError(getResponseError(err));
    }
  };

  return (
    <Layout title="Sign Up">
      <form className={classes.form} onSubmit={submitHandler}>
        <Typography component="h1" variant="h1">
          Sign Up
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
          required
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
          required
          fullWidth
          name="password"
          label="Confirm Password"
          type="password"
          id="confirmPassword"
          autoComplete="current-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <FormControlLabel
          control={<Checkbox value="remember" color="primary" />}
          label="Remember me"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          Sign Up
        </Button>
        <Box>
          {loading && <CircularProgress></CircularProgress>}
          {error && <Alert severity="error">{error}</Alert>}
        </Box>
        <Grid container>
          <Grid item>
            Already have an account?{' '}
            <Link href="/signin" variant="body2">
              Sign In
            </Link>
          </Grid>
        </Grid>
      </form>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(Signin), {
  ssr: false,
});
