import React, { useContext, useState } from 'react';
import Link from 'next/link';
import { Alert } from '@material-ui/lab';
import Layout from '../components/Layout';
import { Store } from '../components/Store';
import { dbConnect, convertDocToObj } from '../utils/db';
import { setSignout } from '../utils/auth';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
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
import { addToOrder } from '../utils/actions';

export default function Home(props) {
  const classes = useStyles();
  const { userInfo, products } = props;
  const { state, dispatch } = useContext(Store);
  const { cartItems, itemsCount, totalPrice, taxPrice, cartType } = state.cart;

  const proccessToCheckout = () => {};
  return (
    <Layout userInfo={userInfo} title="Shopping Cart">
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
                            onChange={(e) => {
                              addToOrder(
                                dispatch,
                                { ...cartItem, quantity: e.target.value },
                                state.cart.cartItems
                              );
                            }}
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
                        <TableCell align="right">{cartItem.price}</TableCell>

                        <TableCell align="right">
                          <Button variant="contained" color="secondary">
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
                      Subtotal ({itemsCount} items) ${totalPrice}
                    </Typography>
                  </Grid>
                </ListItem>
                <ListItem>
                  {cartItems.length > 0 ? (
                    <Button
                      type="button"
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={proccessToCheckout}
                    >
                      Proceed to checkout
                    </Button>
                  ) : (
                    <Alert icon={false} severity="error">
                      Cart is empty
                    </Alert>
                  )}
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      </Slide>
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
