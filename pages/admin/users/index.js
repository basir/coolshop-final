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
    case 'USER_LIST_REQUEST':
      return { ...state, loading: true };
    case 'USER_LIST_SUCCESS':
      return { ...state, loading: false, users: action.payload };
    case 'USER_LIST_FAIL':
      return { ...state, loading: false, error: action.payload };

    case 'USER_DELETE_REQUEST':
      return { ...state, loadingDelete: true };
    case 'USER_DELETE_SUCCESS':
      return { ...state, loadingDelete: false, successDelete: true };
    case 'USER_DELETE_FAIL':
      return { ...state, loadingDelete: false, errorDelete: action.payload };
    case 'USER_DELETE_RESET':
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

function Users() {
  const [
    { loading, error, users, loadingDelete, errorDelete, successDelete },
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
    const fecthUsers = async () => {
      dispatch({ type: 'USER_LIST_REQUEST' });
      try {
        const { data } = await Axios.get(`/api/users`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'USER_LIST_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'USER_LIST_FAIL',
          payload: getResponseError(err),
        });
      }
    };
    fecthUsers();
  }, [successDelete]);

  const deleteUserHandler = async (user) => {
    if (!window.confirm('Are you sure to delete?')) {
      return;
    }
    dispatch({ type: 'USER_DELETE_REQUEST' });
    try {
      const { data } = await Axios.delete(`/api/users/${user._id}`, {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });
      dispatch({ type: 'USER_DELETE_SUCCESS', payload: data });
    } catch (error) {
      dispatch({
        type: 'USER_DELETE_FAIL',
        payload: getResponseError(error),
      });
    }
  };

  const createUserHandler = async () => {
    dispatch({ type: 'USER_CREATE_REQUEST' });
    try {
      const { data } = await Axios.post(
        `/api/users`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'USER_CREATE_SUCCESS', payload: data });
      Router.push(`/admin/users/${data.user._id}`);
    } catch (error) {
      dispatch({
        type: 'USER_CREATE_FAIL',
        payload: getResponseError(error),
      });
    }
  };

  return (
    <Layout title="Admin Users">
      {loading ? (
        <CircularProgress></CircularProgress>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <React.Fragment>
          <Typography component="h1" variant="h1">
            Admin Users
          </Typography>
          {errorDelete && <Alert severity="error">{errorDelete}</Alert>}
          {loadingDelete && <CircularProgress />}
          {successDelete && (
            <Alert severity="success">User deleted successfully</Alert>
          )}

          <Slide direction="up" in={true}>
            <TableContainer>
              <Table aria-label="Users">
                <TableHead>
                  <TableRow>
                    <TableCell>Id</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>email</TableCell>
                    <TableCell>IsAdmin</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell component="th" scope="row">
                        ...{user._id.substring(20, 24)}
                      </TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.isAdmin ? 'Yes' : 'No'}</TableCell>
                      <TableCell>
                        <Link href={`/admin/users/${user._id}`}>
                          <Button>Edit</Button>
                        </Link>
                        <Button onClick={() => deleteUserHandler(user)}>
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

export default dynamic(() => Promise.resolve(Users), {
  ssr: false,
});
