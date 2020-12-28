import React from 'react';
import getCommerce from '../utils/commerce';

import Link from 'next/link';
import { Alert } from '@material-ui/lab';
import Layout from '../components/Layout';
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
import { useStyles } from '../utils/styles';

export default function Home(props) {
  const classes = useStyles();
  const { products } = props;

  return (
    <Layout title="Home" commercePublicKey={props.commercePublicKey}>
      {products.length === 0 && (
        <Alert severity="success">No product found</Alert>
      )}
      <Grid container spacing={1}>
        {products.map((product) => (
          <Slide key={product.id} direction="up" in={true}>
            <Grid item md={3}>
              <Card className={classes.card}>
                <Link href={`/products/${product.permalink}`}>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      alt={product.name}
                      image={product.media.source}
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
                          variant="body1"
                          color="textPrimary"
                          component="p"
                        >
                          {product.price.formatted_with_symbol}
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

export async function getStaticProps() {
  const commerce = getCommerce();
  const { data: products } = await commerce.products.list();

  return {
    props: {
      products,
    },
  };
}
