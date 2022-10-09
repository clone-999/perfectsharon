import { Link } from '@mui/material';
import NextLink from 'next/link';
import {
    Alert,
    Button,
    CircularProgress,
    Grid,
    MenuItem,
    Rating,
    Select,
    Typography,
  } from '@mui/material';
  import { Box } from '@mui/system';
  import axios from 'axios';
  import { useRouter } from 'next/router';
  import { useSnackbar } from 'notistack';
  import React, { useContext, useEffect, useState } from 'react';
  import ProductItem from '../components/ProductItem';
  import classes from '../utils/classes';
  import client from '../utils/client';
  import { urlForThumbnail } from '../utils/image';
  import { Store } from '../utils/Store';
  import Layout from "../components/Layout";

const prices = [
    {
      name: '$1 to $50',
      value: '1-50',
    },
    {
      name: '$51 to $200',
      value: '51-200',
    },
    {
      name: '$201 to $1000',
      value: '201-1000',
    },
  ];
  
  const ratings = [1, 2, 3, 4, 5];

function SearchScreen() {
    const router = useRouter();
  const {
    category = 'all',
    query = 'all',
    price = 'all',
    rating = 'all',
    sort = 'default',
  } = router.query;
  const [state, setState] = useState({
    categories: [],
    products: [],
    error: '',
    loading: true,
  });

  const { loading, products, error } = state;
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchCategories();

    const fetchData = async () => {
      try {
        let gQuery = '*[_type == "product"';
        if (category !== 'all') {
          gQuery += ` && category match "${category}" `;
        }
        if (query !== 'all') {
          gQuery += ` && name match "${query}" `;
        }
        if (price !== 'all') {
          const minPrice = Number(price.split('-')[0]);
          const maxPrice = Number(price.split('-')[1]);
          gQuery += ` && price >= ${minPrice} && price <= ${maxPrice}`;
        }
        if (rating !== 'all') {
          gQuery += ` && rating >= ${Number(rating)} `;
        }
        let order = '';
        if (sort !== 'default') {
          if (sort === 'lowest') order = '| order(price asc)';
          if (sort === 'highest') order = '| order(price desc)';
          if (sort === 'toprated') order = '| order(rating desc)';
        }

        gQuery += `] ${order}`;
        setState({ loading: true });

        const products = await client.fetch(gQuery);
        setState({ products, loading: false });
      } catch (err) {
        setState({ error: err.message, loading: false });
      }
    };
    fetchData();
  }, [category, price, query, rating, sort]);

  const filterSearch = ({ category, sort, searchQuery, price, rating }) => {
    const path = router.pathname;
    const { query } = router;
    if (searchQuery) query.searchQuery = searchQuery;
    if (category) query.category = category;
    if (sort) query.sort = sort;
    if (price) query.price = price;
    if (rating) query.rating = rating;

    router.push({
      pathname: path,
      query: query,
    });
  };
  const categoryHandler = (e) => {
    filterSearch({ category: e.target.value });
  };
  const sortHandler = (e) => {
    filterSearch({ sort: e.target.value });
  };
  const priceHandler = (e) => {
    filterSearch({ price: e.target.value });
  };
  const ratingHandler = (e) => {
    filterSearch({ rating: e.target.value });
  };

  const {
    state: { cart },
    dispatch,
  } = useContext(Store);

  const { enqueueSnackbar } = useSnackbar();
  
  const addToCartHandler = async (product) => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      enqueueSnackbar('Sorry. Product is out of stock', { variant: 'error' });
      return;
    }
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: {
        _key: product._id,
        name: product.name,
        countInStock: product.countInStock,
        slug: product.slug.current,
        price: product.price,
        image: urlForThumbnail(product.image),
        quantity,
      },
    });
    enqueueSnackbar(`${product.name} added to the cart`, {
      variant: 'success',
    });
    router.push('/cart');
  };

    return (
        <Layout title="search">
            <div className="breadcrumb-option">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="breadcrumb__links">
                            <NextLink href="/" passHref>
                                <Link>
                                <i className="fa fa-home"></i> Home
                                </Link>
                            </NextLink>
                            <span>Search</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <section className="shop spad">
                <div className="container">
                    <div className="row">
                        
                        <div className="col-lg-3 col-md-3">
                            <div className="shop__sidebar">
                                <div className="sidebar__categories">
                                    <div className="section-title">
                                        <h4>Categories</h4>
                                    </div>
                                    <div className="categories__accordion">
                                        <div className="accordion" id="accordionExample">
                                            <div className="card">
                                                <div className="card-heading active">
                                                    <Box sx={classes.fullWidth}>
                                                        <Select fullWidth value={category} onChange={categoryHandler}>
                                                        <MenuItem value="all">All</MenuItem>
                                                        {categories &&
                                                            categories.map((category) => (
                                                            <MenuItem key={category} value={category}>
                                                                {category}
                                                            </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </Box>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="sidebar__filter">
                                    <div className="section-title">
                                        <h4>Prices</h4>
                                    </div>
                                    <div className="filter-range-wrap">
                                        <Box sx={classes.fullWidth}>
                                            <Select value={price} onChange={priceHandler} fullWidth>
                                            <MenuItem value="all">All</MenuItem>
                                            {prices.map((price) => (
                                                <MenuItem key={price.value} value={price.value}>
                                                  {price.name}
                                                </MenuItem>
                                            ))}
                                            </Select>
                                        </Box>
                                    </div>
                                </div>

                                <div className="sidebar__sizes">
                                    <div className="section-title">
                                        <h4>Ratings</h4>
                                    </div>
                                    <Box sx={classes.fullWidth}>
                                        <Select value={rating} onChange={ratingHandler} fullWidth>
                                        <MenuItem value="all">All</MenuItem>
                                        {ratings.map((rating) => (
                                            <MenuItem dispaly="flex" key={rating} value={rating}>
                                            <Rating value={rating} readOnly />
                                            <Typography component="span">&amp; Up</Typography>
                                            </MenuItem>
                                        ))}
                                        </Select>
                                    </Box>
                                </div>

                            </div>
                        </div>

                        <div className="col-lg-9 col-md-9">
                            <div className='row'>
                                <div className="col-lg-9 col-md-9">
                                    <Grid item>
                                        {products && products.length !== 0 ? products.length : 'No'}{' '}
                                        Results
                                        {query !== 'all' && query !== '' && ' : ' + query}
                                        {price !== 'all' && ' : Price ' + price}
                                        {rating !== 'all' && ' : Rating ' + rating + ' & up'}
                                        {(query !== 'all' && query !== '') ||
                                        rating !== 'all' ||
                                        price !== 'all' ? (
                                            <Button onClick={() => router.push('/search')}>X</Button>
                                        ) : null}
                                    </Grid>
                                </div>
                                <div className="col-lg-3 col-md-3">
                                    <Grid item>
                                        <Typography component="span" sx={classes.sort}>
                                            Sort by
                                        </Typography>
                                        <Select value={sort} onChange={sortHandler}>
                                            <MenuItem value="default">Default</MenuItem>
                                            <MenuItem value="lowest">Price: Low to High</MenuItem>
                                            <MenuItem value="highest">Price: High to Low</MenuItem>
                                            <MenuItem value="toprated">Customer Reviews</MenuItem>
                                        </Select>
                                    </Grid>
                                </div>
                            </div>
                            <br />
                            <div className="row">
                            {loading ? (
                                <CircularProgress />
                                ) : error ? (
                                <Alert>{error}</Alert>
                                ) : (
                                    <>
                                        {products.map((product) => (
                                            <div className="col-lg-4 col-md-6" key={product.name}>
                                                <ProductItem
                                                  product={product}
                                                  addToCartHandler={addToCartHandler}
                                                />
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </Layout>
    )
}

export default SearchScreen