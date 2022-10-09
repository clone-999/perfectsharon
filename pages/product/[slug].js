import Image from 'next/image';
import NextLink from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import Layout from '../../components/Layout';
import classes from '../../utils/classes';
import client from '../../utils/client';
import { urlFor, urlForThumbnail } from '../../utils/image';
import { Store } from '../../utils/Store';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Alert, CircularProgress, Link, Rating } from '@mui/material';

export default function ProductScreen(props) {
  const router = useRouter();
  const { slug } = props;
  const {
    state: { cart },
    dispatch,
  } = useContext(Store);
  const { enqueueSnackbar } = useSnackbar();
  const [state, setState] = useState({
    product: null,
    loading: true,
    error: '',
  });
  const { product, loading, error } = state;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const product = await client.fetch(
          `*[_type == "product" && slug.current == $slug][0]{
            _id,
            name,
            price,
            image,
            category,
            slug,
            rating,
            numReviews,
            description,
            countInStock
        }`,
          { slug }
        );
        setState({ ...state, product, loading: false });
      } catch (err) {
        setState({ ...state, error: err.message, loading: false });
      }
    };
    fetchData();
  }, []);

  const addToCartHandler = async () => {
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
    <Layout title={product?.title}>
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
                      <span>Product</span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert variant="error">{error}</Alert>
      ) : (
      <section className="product-details spad">
        <div class="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="product__details__pic">
                <div className="product__details__pic__left product__thumb nice-scroll">
                      <a className="pt active" href="#product-1">
                      <Image
                        src={urlFor(product.image)}
                        alt={product.name}
                        layout="responsive"
                        width={200}
                        height={200}
                      />
                      </a>
                  </div>
                  <div className="product__details__slider__content">
                      <div className="product__details__pic__slider owl-carousel2">
                      <Image
                        src={urlFor(product.image)}
                        alt={product.name}
                        layout="responsive"
                        width={640}
                        height={640}
                      />
                      </div>
                  </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="product__details__text">
                <h3>{product.name} <span>Brand: {product.brand}</span></h3>
                <div className="rating">
                  <Rating value={product.rating} readOnly></Rating>
                  <span>( {product.numReviews} reviews )</span>
                </div>
              </div>
              <div className="product__details__price">${product.price} <span></span></div>
              <p>{product.description}</p>
              <div className="product__details__button">
                <a href="#" className="cart-btn" onClick={addToCartHandler}>
                  <span className="icon_bag_alt"></span> Add to cart
                </a>
              </div>
              <div className="product__details__widget">
                <ul>
                  <li>
                    <span>Availability:</span>
                    <div className="stock__checkbox">
                        <label for="stockin">
                          {product.countInStock > 0
                            ? 'In stock'
                            : 'Unavailable'}
                        </label>
                    </div>
                  </li>
                  <li>
                    <span>Category:</span>
                    <div className="stock__checkbox">
                      <label for="stockin">
                        {product.category}
                      </label>
                    </div>
                  </li>
                </ul>
              </div>
              
            </div>
          </div>
        </div>
      </section>
      ) }
    </Layout>
  )
}

export function getServerSideProps(context) {
  console.log("Slug", context.params.slug);
  return {
    props: { slug: context.params.slug },
  };
}
