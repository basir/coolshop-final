import React from 'react';
import Link from 'next/link';
import { Alert } from '@material-ui/lab';
import Layout from '../components/Layout';
import { dbConnect, dbDisconnect, convertDocToObj } from '../utils/db';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Slide,
  Typography,
} from '@material-ui/core';
import Product from '../models/Product';
import { useStyles } from '../utils/styles';

export default function Home(props) {
  const classes = useStyles();
  const { userInfo, products } = props;

  return (
    <Layout userInfo={userInfo} title="Home">
      <Grid container spacing={1}>
        {products.length === 0 && (
          <Alert severity="success">No product found</Alert>
        )}
        {products.map((product) => (
          <Slide key={product.name} direction="up" in={true}>
            <Grid item md={3}>
              <Card className={classes.card}>
                <Link href={`/products/${product._id}`}>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      alt={product.name}
                      image={product.image}
                      className={classes.media}
                    />
                    <CardContent>
                      <Typography
                        gutterBottom
                        variant="body2"
                        color="textPrimary"
                        component="p"
                      >
                        {product.name}
                      </Typography>
                      <Box className={classes.cardFooter}>
                        <Typography
                          variant="body2"
                          color="textPrimary"
                          component="p"
                        >
                          ${product.price}
                        </Typography>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Link>
              </Card>
            </Grid>
          </Slide>
        ))}
      </Grid>
    </Layout>
  );
}
export async function getServerSideProps() {
  await dbConnect();
  const productDocs = await Product.find({}).lean();
  await dbDisconnect();
  const products = productDocs.map(convertDocToObj);
  return {
    props: { products },
  };
}
