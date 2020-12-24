import { createMuiTheme, fade, makeStyles } from '@material-ui/core';
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
  fullWidth: {
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
    marginTop: '1rem !important',
  },
  p1: {
    padding: '1rem !important',
  },
  m1: {
    margin: '1rem !important',
  },
  p0: {
    padding: '0 !important',
  },
  // search
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: `${theme.spacing(1, 1, 1, 0)}`,
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)!important`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));
