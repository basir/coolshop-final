import React, { useContext, useEffect, useState } from 'react';
import getCommerce from '../utils/commerce';

import Link from 'next/link';
import { Alert } from '@material-ui/lab';
import Layout from '../components/Layout';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Slide,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from '@material-ui/core';
import { useStyles } from '../utils/styles';
import { Store } from '../components/Store';
import Router from 'next/router';
import { ORDER_SET } from '../utils/constants';

export default function Home(props) {
  const classes = useStyles();

  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const [checkoutToken, setCheckoutToken] = useState({});
  // Customer details
  const [firstName, setFirstName] = useState('Jane');
  const [lastName, setLastName] = useState('Doe');
  const [email, setEmail] = useState('janedoe@email.com');
  // Shipping details
  const [shippingName, setShippingName] = useState('Jane Doe');
  const [shippingStreet, setShippingStreet] = useState('123 Fake St');
  const [shippingCity, setShippingCity] = useState('Los Angeles');
  const [shippingStateProvince, setShippingStateProvince] = useState('AR');
  const [shippingPostalZipCode, setShippingPostalZipCode] = useState('90089');
  const [shippingCountry, setShippingCountry] = useState('GB');
  // Payment details
  const [cardNum, setCardNum] = useState('4242 4242 4242 4242');
  const [expMonth, setExpMonth] = useState('11');
  const [expYear, setExpYear] = useState('2023');
  const [cvv, setCvv] = useState('123');
  const [billingPostalZipcode, setBillingPostalZipcode] = useState('90089');
  // Shipping and fulfillment data
  const [shippingCountries, setShippingCountries] = useState({});
  const [shippingSubdivisions, setShippingSubdivisions] = useState({});
  const [shippingOptions, setShippingOptions] = useState([]);
  const [shippingOption, setShippingOption] = useState({});

  useEffect(() => {
    if (!cart.loading) {
      generateCheckoutToken();
    }
  }, [cart.loading]);
  const generateCheckoutToken = async () => {
    if (cart.data.line_items.length) {
      const commerce = getCommerce(props.commercePublicKey);
      const token = await commerce.checkout.generateToken(cart.data.id, {
        type: 'cart',
      });
      setCheckoutToken(token);
      fetchShippingCountries();
    } else {
      Router.push('/cart');
    }
  };

  const fetchShippingCountries = async () => {
    const commerce = getCommerce(props.commercePublicKey);
    const countries = await commerce.services.localeListCountries();
    setShippingCountries(countries.countries);
  };

  const fetchSubdivisions = async (countryCode) => {
    const commerce = getCommerce(props.commercePublicKey);
    const subdivisions = await commerce.services.localeListSubdivisions(
      countryCode
    );
    setShippingSubdivisions(subdivisions.subdivisions);
  };

  const fetchShippingOptions = async (
    checkoutTokenId,
    country,
    stateProvince = null
  ) => {
    const commerce = getCommerce(props.commercePublicKey);
    const options = await commerce.checkout.getShippingOptions(
      checkoutTokenId,
      {
        country: country,
        region: stateProvince,
      }
    );

    const shippingOption = options[0] ? options[0].id : null;
    setShippingOption(shippingOption);
    setShippingOptions(options);
  };

  const handleShippingCountryChange = (e) => {
    const currentValue = e.target.value;
    setShippingCountry(e.target.value);
    fetchSubdivisions(currentValue);
  };

  const handleSubdivisionChange = (e) => {
    const currentValue = e.target.value;
    setShippingStateProvince(currentValue);
    fetchShippingOptions(checkoutToken.id, shippingCountry, currentValue);
  };

  const handleShippingOptionChange = (e) => {
    const currentValue = e.target.value;
    setShippingOption(currentValue);
    console.log(currentValue);
  };

  const handleCaptureCheckout = async (e) => {
    // e.preventDefault();
    const orderData = {
      line_items: checkoutToken.live.line_items,
      customer: {
        firstname: firstName,
        lastname: lastName,
        email: email,
      },
      shipping: {
        name: shippingName,
        street: shippingStreet,
        town_city: shippingCity,
        county_state: shippingStateProvince,
        postal_zip_code: shippingPostalZipCode,
        country: shippingCountry,
      },
      fulfillment: {
        shipping_method: shippingOption,
      },
      payment: {
        gateway: 'test_gateway',
        card: {
          number: cardNum,
          expiry_month: expMonth,
          expiry_year: expYear,
          cvc: cvv,
          postal_zip_code: billingPostalZipcode,
        },
      },
    };

    const commerce = getCommerce(props.commercePublicKey);
    const order = await commerce.checkout.capture(checkoutToken.id, orderData);
    dispatch({ type: ORDER_SET, payload: order });

    localStorage.setItem('order_receipt', JSON.stringify(order));
    await refreshCart();
    Router.push('/confirmation');
  };

  const refreshCart = async () => {
    const commerce = getCommerce(props.commercePublicKey);

    commerce.cart
      .refresh()
      .then((newCart) => {
        this.setState({
          cart: newCart,
        });
      })
      .catch((error) => {
        console.log('There was an error refreshing your cart', error);
      });
  };

  const [activeStep, setActiveStep] = React.useState(1);
  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);

    if (activeStep === steps.length - 1) {
      handleCaptureCheckout();
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  function getSteps() {
    return ['Customer information', 'Shipping details', 'Payment information'];
  }

  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="firstName"
              label="First Name"
              name="firstName"
              autoComplete="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="lastName"
              label="Last Name"
              name="lastName"
              autoComplete="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </>
        );
      case 1:
        return (
          <>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="shippingName"
              label="shippingName"
              name="shippingName"
              autoComplete="shippingName"
              value={shippingName}
              onChange={(e) => setShippingName(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="shippingStreet"
              label="shippingStreet"
              name="shippingStreet"
              autoComplete="shippingStreet"
              value={shippingStreet}
              onChange={(e) => setShippingStreet(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="shippingCity"
              label="shippingCity"
              name="shippingCity"
              autoComplete="shippingCity"
              value={shippingCity}
              onChange={(e) => setShippingCity(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="shippingPostalZipCode"
              label="shippingPostalZipCode"
              name="shippingPostalZipCode"
              autoComplete="shippingPostalZipCode"
              value={shippingPostalZipCode}
              onChange={(e) => setShippingPostalZipCode(e.target.value)}
            />
            <FormControl className={classes.formControl}>
              <InputLabel id="shippingCountry-label">Country</InputLabel>
              <Select
                labelId="shippingCountry-label"
                id="shippingCountry"
                label="Country"
                fullWidth
                onChange={handleShippingCountryChange}
                value={shippingCountry}
              >
                {Object.keys(shippingCountries).map((index) => (
                  <MenuItem value={index} key={index}>
                    {shippingCountries[index]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel id="shippingStateProvince-label">
                State / Province
              </InputLabel>

              <Select
                labelId="shippingStateProvince-label"
                id="shippingStateProvince"
                label="StateProvince"
                fullWidth
                onChange={handleSubdivisionChange}
                value={shippingStateProvince}
                required
                className={classes.mt1}
              >
                {Object.keys(shippingSubdivisions).map((index) => (
                  <MenuItem value={index} key={index}>
                    {shippingSubdivisions[index]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel id="shippingOption-label">Shipping Option</InputLabel>

              <Select
                labelId="shippingOption-label"
                id="shippingOption"
                label="shippingOption"
                fullWidth
                onChange={handleShippingOptionChange}
                value={shippingOption}
                required
                className={classes.mt1}
              >
                {shippingOptions.map((method, index) => (
                  <MenuItem
                    value={method.id}
                    key={index}
                  >{`${method.description} - $${method.price.formatted_with_code}`}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        );
      case 2:
        return (
          <>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="cardNum"
              label="cardNum"
              name="cardNum"
              autoComplete="cardNum"
              value={cardNum}
              onChange={(e) => setCardNum(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="expMonth"
              label="expMonth"
              name="expMonth"
              autoComplete="expMonth"
              value={expMonth}
              onChange={(e) => setExpMonth(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="expYear"
              label="expYear"
              name="expYear"
              autoComplete="expYear"
              value={expYear}
              onChange={(e) => setExpYear(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="cvv"
              label="cvv"
              name="cvv"
              autoComplete="shicvvppingPostalZipCode"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
            />
          </>
        );
      default:
        return 'Unknown step';
    }
  }

  const renderCheckoutForm = () => {
    return (
      <form>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <div>
          {activeStep === steps.length ? (
            <div>
              <CircularProgress />
              <Typography className={classes.instructions}>
                Confirming Order...
              </Typography>
            </div>
          ) : (
            <div>
              {getStepContent(activeStep)}
              <div className={classes.mt1}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  className={classes.button}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  className={classes.button}
                >
                  {activeStep === steps.length - 1 ? 'Confirm Order' : 'Next'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </form>
    );
  };

  const renderCheckoutSummary = () => {
    return (
      <>
        <div className="checkout__summary">
          <h4>Order summary</h4>
          {cart.data.line_items.map((lineItem) => (
            <div key={lineItem.id} className="checkout__summary-details">
              <p>
                {lineItem.quantity} x {lineItem.name}
              </p>
              <p>{lineItem.line_total.formatted_with_symbol}</p>
            </div>
          ))}
          <div>
            <p>
              <span>Subtotal:</span>
              {cart.data.subtotal.formatted_with_symbol}
            </p>
          </div>
        </div>
      </>
    );
  };

  return (
    <Layout title="Checkout" commercePublicKey={props.commercePublicKey}>
      <Typography gutterBottom variant="h6" color="textPrimary" component="h1">
        Checkout
      </Typography>
      {cart.loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2}>
          <Grid item md={8}>
            <Card className={classes.p1}>{renderCheckoutForm()}</Card>
          </Grid>
          <Grid item md={4}>
            <Card className={classes.p1}>{renderCheckoutSummary()}</Card>
          </Grid>
        </Grid>
      )}
    </Layout>
  );
}

export async function getStaticProps() {
  const commerce = getCommerce();
  // const merchant = await commerce.merchants.about();
  const { data: products } = await commerce.products.list();

  return {
    props: {
      // merchant,
      products,
    },
  };
}
