import React, { useContext, useState } from 'react';
import Rating from '@material-ui/lab/Rating';
import { Alert } from '@material-ui/lab';
import { dbConnect, dbDisconnect } from '../../utils/db';
import {
  Box,
  Button,
  Card,
  Grid,
  List,
  ListItem,
  MenuItem,
  Select,
  Slide,
  Typography,
} from '@material-ui/core';
import Product from '../../models/Product';
import { useStyles } from '../../utils/styles';
import { convertDocToObj } from '../../utils/db';
import Layout from '../../components/Layout';
import { Store } from '../../components/Store';
import Router from 'next/router';
import { CART_ADD_ITEM } from '../../utils/constants';

export default function Home(props) {
  const classes = useStyles();

  const { dispatch } = useContext(Store);
  const [quantity, setQuantity] = useState(1);
  const { userInfo, product } = props;
  const addToCartHandler = () => {
    // add
    dispatch({
      type: CART_ADD_ITEM,
      payload: {
        name: product.name,
        image: product.image,
        price: product.price,
        countInStock: product.countInStock,
        quantity,
      },
    });
    Router.push('/cart');
  };

  return (
    <Layout userInfo={userInfo} title={product.name}>
      <Slide key={product.name} direction="up" in={true}>
        <Grid container spacing={1}>
          <Grid item md={6}>
            <img
              src={product.image}
              alt={product.name}
              className={classes.largeImage}
            />
          </Grid>
          <Grid item md={3} xs={12}>
            <List>
              <ListItem>
                <Typography
                  gutterBottom
                  variant="h6"
                  color="textPrimary"
                  component="h1"
                >
                  {product.name}
                </Typography>
              </ListItem>
              <ListItem>
                <Rating
                  name="simple-controlled"
                  value={product.rating}
                  readOnly
                />
                {<Box ml={2}>{`${product.numReviews} reviews`}</Box>}
              </ListItem>
              <ListItem>
                <Typography
                  gutterBottom
                  variant="body2"
                  color="textPrimary"
                  component="p"
                >
                  {product.description}
                </Typography>
              </ListItem>
            </List>
          </Grid>
          <Grid item md={3} xs={12}>
            <Card className={classes.card}>
              <List>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      Price
                    </Grid>
                    <Grid item xs={6}>
                      ${product.price}
                    </Grid>
                  </Grid>
                </ListItem>

                <ListItem>
                  <Grid alignItems="center" container>
                    <Grid item xs={6}>
                      Status
                    </Grid>
                    <Grid item xs={6}>
                      {product.countInStock > 0 ? (
                        <Alert icon={false} severity="success">
                          In Stock
                        </Alert>
                      ) : (
                        <Alert icon={false} severity="error">
                          Unavailable
                        </Alert>
                      )}
                    </Grid>
                  </Grid>
                </ListItem>
                {product.countInStock > 0 && (
                  <>
                    <ListItem>
                      <Grid container justify="flex-end">
                        <Grid item xs={6}>
                          Quantity
                        </Grid>
                        <Grid item xs={6} className={classes.textRight}>
                          <Select
                            labelId="quanitity-label"
                            id="quanitity"
                            fullWidth
                            onChange={(e) => setQuantity(e.target.value)}
                            value={quantity}
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <MenuItem key={x + 1} value={x + 1}>
                                  {x + 1}
                                </MenuItem>
                              )
                            )}
                          </Select>
                        </Grid>
                      </Grid>
                    </ListItem>
                    <ListItem>
                      <Button
                        type="button"
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={addToCartHandler}
                      >
                        Add to cart
                      </Button>
                    </ListItem>
                  </>
                )}
              </List>
            </Card>
          </Grid>
        </Grid>
      </Slide>
    </Layout>
  );
}
export async function getServerSideProps({ params }) {
  await dbConnect();
  const productDoc = await Product.findById(params.id).lean();
  await dbDisconnect();
  const product = convertDocToObj(productDoc);
  return {
    props: { product },
  };
}
