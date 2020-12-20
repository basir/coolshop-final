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

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const classes = useStyles();
  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await Axios.post('/api/users/signin', {
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
    <Layout title="Sign In">
      <form className={classes.form} onSubmit={submitHandler}>
        <Typography component="h1" variant="h1">
          Sign In
        </Typography>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
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
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
          Sign In
        </Button>
        <Box>
          {loading && <CircularProgress></CircularProgress>}
          {error && <Alert severity="error">{error}</Alert>}
        </Box>
        <Grid container>
          <Grid item xs>
            <Link href="/forget-password" variant="body2">
              Forgot password?
            </Link>
          </Grid>
          <Grid item>
            Don't have an account?{' '}
            <Link href="/signup" variant="body2">
              Sign Up
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
