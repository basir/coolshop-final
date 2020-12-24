import React from 'react';
import Link from 'next/link';
import { Alert } from '@material-ui/lab';
import Layout from '../components/Layout';
import { convertDocToObj } from '../utils/index';
import db from '../utils/db';
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
import { NextPagination } from '../components/NextPagination';

export default function Home(props) {
  const classes = useStyles();
  const { userInfo, products, countProducts, pages } = props;

  return (
    <Layout userInfo={userInfo} title="Search">
      <Typography component="h1" variant="h1">
        Search Result
      </Typography>
      <Alert severity="info">
        {countProducts === 0
          ? 'No product found'
          : `${countProducts} products found`}
      </Alert>
      <Grid container spacing={1} className={classes.mt1}>
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
      <NextPagination
        className={classes.mt1}
        totalPages={pages}
      ></NextPagination>
    </Layout>
  );
}
export async function getServerSideProps({ query }) {
  await db.connect();
  const pageSize = 3;
  const page = Number(query.page) || 1;
  const name = query.name || '';
  const category = query.category || '';
  const order = query.order || '';
  const min = query.min && Number(query.min) !== 0 ? Number(query.min) : 0;
  const max = query.max && Number(query.max) !== 0 ? Number(query.max) : 0;
  const rating =
    query.rating && Number(query.rating) !== 0 ? Number(query.rating) : 0;

  const nameFilter = name ? { name: { $regex: name, $options: 'i' } } : {};
  const categoryFilter = category ? { category } : {};
  const priceFilter = min && max ? { price: { $gte: min, $lte: max } } : {};
  const ratingFilter = rating ? { rating: { $gte: rating } } : {};
  const sortOrder =
    order === 'lowest'
      ? { price: 1 }
      : order === 'highest'
      ? { price: -1 }
      : order === 'toprated'
      ? { rating: -1 }
      : { _id: -1 };
  const countProducts = await Product.countDocuments({
    ...nameFilter,
    ...categoryFilter,
    ...priceFilter,
    ...ratingFilter,
  });
  const productDocs = await Product.find({
    ...nameFilter,
    ...categoryFilter,
    ...priceFilter,
    ...ratingFilter,
  })
    .sort(sortOrder)
    .skip(pageSize * (page - 1))
    .limit(pageSize)
    .lean();
  await db.disconnect();
  const products = productDocs.map(convertDocToObj);
  return {
    props: {
      products,
      page,
      countProducts,
      pages: Math.ceil(countProducts / pageSize),
    },
  };
}
