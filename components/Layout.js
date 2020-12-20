/* next.js head */
import Head from 'next/head';

import React, { useContext } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

import NextLink from 'next/link';
import { ThemeProvider } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import { theme } from '../utils/styles';
import { siteName } from '../utils/config';
import { Menu, MenuItem } from '@material-ui/core';
import { useStyles } from '../utils/styles';
import { Store } from './Store';
import { USER_SIGN_OUT } from '../utils/constants';
import Router from 'next/router';
import Cookies from 'js-cookie';

export default function Layout({ children, title = 'NextJS Hello' }) {
  const classes = useStyles();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  const signoutHandler = () => {
    dispatch({ type: USER_SIGN_OUT });
    Cookies.remove('userInfo');
    Router.push('/');
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const [anchorEl, setAnchorEl] = React.useState(null);
  return (
    <React.Fragment>
      <Head>
        <meta charSet="utf-8" />
        <title>{`${title} - ${siteName}`}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <AppBar
          position="static"
          color="default"
          elevation={0}
          className={classes.appBar}
        >
          <Toolbar className={classes.toolbar}>
            <NextLink href="/">
              <Link
                variant="h6"
                color="inherit"
                noWrap
                href="/"
                className={classes.toolbarTitle}
              >
                {siteName}
              </Link>
            </NextLink>

            <nav>
              <NextLink href="/cart">
                <Link
                  variant="button"
                  color="textPrimary"
                  href="/cart"
                  className={classes.link}
                >
                  Cart
                </Link>
              </NextLink>
            </nav>
            {userInfo ? (
              <>
                <Button aria-controls="simple-menu" onClick={handleClick}>
                  {userInfo.name}
                </Button>
                <Menu
                  id="simple-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={signoutHandler}>Sign Out</MenuItem>
                  <MenuItem>
                    <NextLink href="/profile">
                      <Link color="primary" href="/profile">
                        User Profile
                      </Link>
                    </NextLink>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <NextLink href="/signin">
                <Button
                  color="primary"
                  variant="outlined"
                  className={classes.link}
                >
                  Sign In
                </Button>
              </NextLink>
            )}
          </Toolbar>
        </AppBar>
        {/* Hero unit */}
        <Container component="main" className={classes.heroContent}>
          {children}
        </Container>
        {/* End hero unit */}
        <Container maxWidth="md" component="footer">
          <Box mt={5}>
            <Typography variant="body2" color="textSecondary" align="center">
              {'© '}
              {siteName} {new Date().getFullYear()}
              {'.'}
            </Typography>
          </Box>
        </Container>
        {/* End footer */}
      </ThemeProvider>
    </React.Fragment>
  );
}
