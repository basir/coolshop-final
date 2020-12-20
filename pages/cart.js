import React, { useContext } from 'react';
import { Alert } from '@material-ui/lab';
import Layout from '../components/Layout';
import { Store } from '../components/Store';
import { dbConnect, convertDocToObj } from '../utils/db';
import {
  Button,
  Card,
  Grid,
  List,
  ListItem,
  MenuItem,
  Select,
  Slide,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import Product from '../models/Product';
import { useStyles } from '../utils/styles';
import { calcCartSummary } from '../utils';
import { CART_ADD_ITEM, CART_REMOVE_ITEM } from '../utils/constants';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Router from 'next/router';

function Cart(props) {
  if (typeof window === 'undefined') {
    return null;
  }
  const classes = useStyles();
  const { userInfo } = props;
  const { state, dispatch } = useContext(Store);
  const { cartItems } = state.cart;
  const { itemsCount, itemsPrice } = calcCartSummary(cartItems);

  const removeFromCartHandler = (product) => {
    dispatch({
      type: CART_REMOVE_ITEM,
      payload: product,
    });
  };
  const quantityChangeHandler = (cartItem, quantity) => {
    dispatch({
      type: CART_ADD_ITEM,
      payload: {
        name: cartItem.name,
        image: cartItem.image,
        price: cartItem.price,
        countInStock: cartItem.countInStock,
        quantity,
      },
    });
  };

  const proccessToCheckout = () => {
    Router.push({
      pathname: '/signin',
      query: { redirect: 'shipping' },
    });
  };
  return (
    <Layout userInfo={userInfo} title="Shopping Cart">
      {cartItems.length === 0 ? (
        <Alert icon={false} severity="error">
          Cart is empty. <Link href="/">Go shopping</Link>
        </Alert>
      ) : (
        <React.Fragment>
          <Typography variant="h1" component="h1">
            Shopping Cart
          </Typography>
          <Slide direction="up" in={true}>
            <Grid container spacing={1}>
              <Grid item md={9}>
                <Grid container>
                  <TableContainer>
                    <Table aria-label="Orders">
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell align="right">Quantity</TableCell>
                          <TableCell align="right">Price</TableCell>
                          <TableCell align="right">Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {cartItems.map((cartItem) => (
                          <TableRow key={cartItem.name}>
                            <TableCell component="th" scope="row">
                              <img
                                className={classes.smallImage}
                                alt={cartItem.name}
                                src={cartItem.image}
                              ></img>
                              {cartItem.name}
                            </TableCell>
                            <TableCell align="right">
                              <Select
                                labelId="quanitity-label"
                                id="quanitity"
                                className={classes.fullWidth}
                                onChange={(e) =>
                                  quantityChangeHandler(
                                    cartItem,
                                    e.target.value
                                  )
                                }
                                value={cartItem.quantity}
                              >
                                {[...Array(cartItem.countInStock).keys()].map(
                                  (x) => (
                                    <MenuItem key={x + 1} value={x + 1}>
                                      {x + 1}
                                    </MenuItem>
                                  )
                                )}
                              </Select>
                            </TableCell>
                            <TableCell align="right">
                              {cartItem.price}
                            </TableCell>

                            <TableCell align="right">
                              <Button
                                onClick={() => removeFromCartHandler(cartItem)}
                                variant="contained"
                                color="secondary"
                              >
                                Remove
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
              <Grid item md={3}>
                <Card className={classes.card}>
                  <List>
                    <ListItem>
                      <Grid container>
                        <Typography variant="h6">
                          Subtotal ({itemsCount} items) ${itemsPrice}
                        </Typography>
                      </Grid>
                    </ListItem>
                    <ListItem>
                      {cartItems.length > 0 && (
                        <Button
                          type="button"
                          fullWidth
                          variant="contained"
                          color="primary"
                          onClick={proccessToCheckout}
                        >
                          Proceed to checkout
                        </Button>
                      )}
                    </ListItem>
                  </List>
                </Card>
              </Grid>
            </Grid>
          </Slide>
        </React.Fragment>
      )}
    </Layout>
  );
}
export async function getServerSideProps() {
  await dbConnect();

  const productDocs = await Product.find({}).lean();

  const products = productDocs.map(convertDocToObj);
  return {
    props: { products },
  };
}
export default dynamic(() => Promise.resolve(Cart), {
  ssr: false,
});
