import { createMuiTheme, makeStyles } from '@material-ui/core';
export const theme = createMuiTheme({
  typography: {
    h1: {
      fontSize: '2.2rem',
      fontWeight: 400,
      margin: '2rem 0',
    },
    h2: {
      fontSize: '1.8rem',
      fontWeight: 400,
      margin: '1rem 0',
    },
  },
  palette: {
    primary: {
      main: '#f0c000',
    },
    secondary: {
      main: '#208080',
    },
    error: {
      main: '#f04000',
    },
    background: {
      default: '#ffffff',
    },
  },
});

export const useStyles = makeStyles((theme) => ({
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbar: {
    flexWrap: 'wrap',
  },
  toolbarTitle: {
    flexGrow: 1,
  },
  link: {
    margin: '1rem',
  },
  main: {
    padding: '1rem',
  },
  submit: {
    margin: '1rem 0 1rem 0',
  },
  smallImage: {
    width: '3rem',
  },
  largeImage: {
    maxWidth: '50rem',
    width: '100%',
  },
  center: {
    margin: '0 auto',
    textAlign: 'center',
  },
  form: {
    maxWidth: '60rem',
    margin: '0 auto',
  },
  mt1: {
    marginTop: '1rem',
  },
  p1: {
    padding: '1rem',
  },
  p0: {
    padding: '0',
  },
}));
