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

export default function Home(props) {
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
              <Card>
                <Link href={`/products/${product.permalink}`}>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      alt={product.name}
                      image={product.media.source}
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
                      <Box>
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
