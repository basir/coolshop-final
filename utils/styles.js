import { createMuiTheme, makeStyles } from '@material-ui/core';
export const theme = createMuiTheme({
  typography: {
    h1: {
      fontSize: '2.2rem',
      fontWeight: 400,
      margin: '1rem 0',
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
      main: '#19857b',
    },
    error: {
      main: '#f04000',
    },
    background: {
      default: '#fff',
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
    margin: theme.spacing(1, 1.5),
  },
  heroContent: {
    padding: theme.spacing(8, 0, 6),
  },
  submit: {
    margin: theme.spacing('1rem', 0, '1rem', 0),
  },
  smallImage: {
    width: 50,
  },
  center: {
    margin: '0 auto',
    textAlign: 'center',
  },
  form: {
    maxWidth: 800,
    margin: '0 auto',
  },
  marginTop: {
    marginTop: '1rem',
  },
  space: {
    padding: '1rem',
  },
}));
