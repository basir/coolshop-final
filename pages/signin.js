import {
  Avatar,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import Cookies from 'js-cookie';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Axios from 'axios';
import Link from 'next/link';
import React, { useState } from 'react';
import Layout from '../components/Layout';
import Router from 'next/router';
import { getResponseError } from '../utils/error';

const useStyles = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function reducer(state, action) {
  switch (action.type) {
    case 'USER_SIGNIN_REQUEST':
      return { loading: true };
    case 'USER_SIGNIN_SUCCESS':
      return { success: true };
    case 'USER_SIGNIN_FAIL':
      return { error: action.payload };
    default:
      return state;
  }
}

export default function Signin() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [{ loading, error }, dispatch] = React.useReducer(reducer, {
    loading: false,
    error: false,
    success: false,
  });

  const classes = useStyles();
  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch({ type: 'USER_SIGNIN_REQUEST' });
    try {
      const { data } = await Axios.post('/api/users/signin', {
        name,
        email,
        password,
      });
      dispatch({ type: 'USER_SIGNIN_SUCCESS' });
      Cookies.set('token', data.token);
      Router.push('/');
    } catch (err) {
      dispatch({ type: 'USER_SIGNIN_FAIL', payload: getResponseError(err) });
    }
  };

  return (
    <Layout title="Sign In">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h5" variant="h5">
          Sign In
        </Typography>
        <form className={classes.form} onSubmit={submitHandler}>
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
      </div>
    </Layout>
  );
}
