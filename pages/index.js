import { Alert, CircularProgress, Grid } from '@mui/material';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useContext, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import ProductItem from '../components/ProductItem';
import client from '../utils/client';
import { urlForThumbnail } from '../utils/image';
import { Store } from '../utils/Store';

export default function Home() {
    const {
        state: { cart },
        dispatch,
      } = useContext(Store);
      const router = useRouter();
      const { enqueueSnackbar } = useSnackbar();
      const [state, setState] = useState({
        products: [],
        error: '',
        loading: true,
        brands: [],
      });
      const { loading, error, products, brands } = state;
    
      useEffect(() => {
        const fetchBrand = async () => {
            try {
              const brands = await client.fetch(`*[_type == "brand"]{
                _id,
                name,
                "products": *[_type == "product" && references(^._id)]{
                    _id,
                    name,
                    price,
                    image,
                    category,
                    slug,
                    rating,
                    numReviews
                }
              }[0..3]`);
              return brands;
              //setState({products, brands, loading: false });
              //console.log('Brand', brands);
            } catch (err) {
              setState({ loading: false, error: err.message });
            }
        };

        const fetchData = async () => {
          try {
            const products = await client.fetch(`*[_type == "product"]`);
            const brands = await fetchBrand();
            setState({ products, brands, loading: false });
          } catch (err) {
            setState({ loading: false, error: err.message });
          }
        };
        fetchData();

      }, []);
    
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
        <Layout>
            <section className="categories">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-6 p-0">
                            <div className="categories__item categories__large__item set-bg"
                                style={{
                                    backgroundImage: "url(" + "/front/img/categories/category-1.jpg" + ")",
                                    backgroundPosition: '-40px 0px',
                                    backgroundSize: 'cover',
                                }}>
                                <div className="categories__text">
                                    <h1>Women’s Confidence</h1>
                                    <p>Designed to reflect a modern take on women’s underwear with the focus of offering simple and sporty-style bikinis that are comfortable, affordable, attractive and pleasant manner.</p>
                                    <a href="#">Shop now</a>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="row">
                                <div className="col-lg-6 col-md-6 col-sm-6 p-0">
                                    <div className="categories__item set-bg" 
                                        style={{
                                            backgroundImage: "url(" + "/front/img/categories/category-2.jpg" + ")",
                                            backgroundPosition: '0px 0px',
                                            backgroundSize: 'cover',
                                        }}>
                                        <div className="categories__text">
                                            <h4>Bra & Underwear</h4>
                                            <p>358 items</p>
                                            <a href="#">Shop now</a>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-6 p-0">
                                    <div className="categories__item set-bg" 
                                        style={{
                                            backgroundImage: "url(" + "/front/img/categories/category-3.jpg" + ")",
                                            backgroundPosition: 'center',
                                            backgroundSize: 'cover',
                                        }}>
                                        <div className="categories__text">
                                            <h4>Bodysuit</h4>
                                            <p>273 items</p>
                                            <a href="#">Shop now</a>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-6 p-0">
                                    <div className="categories__item set-bg" 
                                        style={{
                                            backgroundImage: "url(" + "/front/img/categories/category-4.jpg" + ")",
                                            backgroundPosition: 'center',
                                            backgroundSize: 'cover',
                                        }}>
                                        <div className="categories__text">
                                            <h4>Hipster</h4>
                                            <p>159 items</p>
                                            <a href="#">Shop now</a>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-6 p-0">
                                    <div className="categories__item set-bg" 
                                        style={{
                                            backgroundImage: "url(" + "/front/img/categories/category-5.jpg" + ")",
                                            backgroundPosition: '-140px 0px',
                                            backgroundSize: 'cover',
                                        }}>
                                        <div className="categories__text">
                                            <h4>Bikinis</h4>
                                            <p>792 items</p>
                                            <a href="#">Shop now</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="product spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4 col-md-4">
                            <div className="section-title">
                                <h4>New product</h4>
                            </div>
                        </div>
                        <div className="col-lg-8 col-md-8">
                            <ul className="filter__controls">
                                <li className="active" data-filter="*">All</li>
                            </ul>
                        </div>
                    </div>

                    <div className="row property__gallery">
                        {loading ? (
                            <CircularProgress />
                        ) : error ? (
                            <Alert variant="danger">{error}</Alert>
                        ) : (
                            <>
                                { products && products.map((product, index) => (
                                    <div className="col-lg-3 col-md-4 col-sm-6 mix women" key={index} >
                                        <ProductItem
                                            product={product}
                                            addToCartHandler={addToCartHandler}
                                        ></ProductItem>
                                    </div>
                                ))}
                            </>
                        )}
                        
                    </div>
                </div>
            </section>

            <section className="banner set-bg" 
                style={{
                    backgroundImage: "url(" + "/front/img/banner/banner-1.jpg" + ")",
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                }}>
                <div className="container">
                    <div className="row">
                        <div className="col-xl-7 col-lg-8 m-auto">
                            <div className="banner__slider owl-carousell">
                                <div className="banner__item">
                                    <div className="banner__text">
                                        <span>The Perfect Sharon Collection</span>
                                        <h1>The Latest Design Sets</h1>
                                        <a href="#">Shop now</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="trend spad">
                <div className="container">
                    <div className="row">
                    { brands && brands.map((brand, index) => (
                        <div className="col-lg-4 col-md-4 col-sm-6" key={index}>
                            <div className="trend__content">
                                <div className="section-title">
                                    <h4>{brand.name}</h4>
                                </div>

                                {brand.products && brand.products.map((prod, index) => (
                                    <div className="trend__item" key={index}>
                                        <div className="trend__item__pic">
                                            <Image
                                                src={urlForThumbnail(prod.image)}
                                                alt={prod.name}
                                                width={100}
                                                height={100}
                                                />
                                        </div>
                                        <div className="trend__item__text">
                                            <h6>{prod.name}</h6>
                                            <div className="rating">
                                                <i className="fa fa-star"></i>
                                                <i className="fa fa-star"></i>
                                                <i className="fa fa-star"></i>
                                                <i className="fa fa-star"></i>
                                                <i className="fa fa-star"></i>
                                            </div>
                                            <div className="prod__price">$ {prod.price}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    </div>
                </div>
            </section>
        </Layout>
    );
}