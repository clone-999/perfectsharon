import { Box, Link, MenuItem, Rating, Select, Typography } from '@mui/material';
import axios from 'axios';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useContext } from 'react';
import Layout from '../components/Layout';
import { Store } from '../utils/Store';

export default function CartScreen() {
    const router = useRouter();
    const {
        state: {
        cart: { cartItems },
        },
        dispatch,
    } = useContext(Store);

    const { enqueueSnackbar } = useSnackbar();

    const updateCartHandler = async (item, quantity) => {
        const { data } = await axios.get(`/api/products/${item._id}`);
        if (data.countInStock < quantity) {
        enqueueSnackbar('Sorry. Product is out of stock', { variant: 'error' });
        return;
        }
        dispatch({
        type: 'CART_ADD_ITEM',
        payload: {
            _key: item._key,
            name: item.name,
            countInStock: item.countInStock,
            slug: item.slug,
            price: item.price,
            image: item.image,
            quantity,
        },
        });
        enqueueSnackbar(`${item.name} updated in the cart`, {
        variant: 'success',
        });
    };
    const removeItemHandler = (item) => {
        dispatch({ type: 'CART_REMOVE_ITEM', payload: item });
    };
    return (
        <Layout title="Shopping Cart">
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
                                <span>Shopping Cart</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <section class="shop-cart spad">
                <div class="container">
                {cartItems.length === 0 ? (
                    <Box>
                        <Typography>
                            Cart is empty.{' '}
                            <NextLink href="/" passHref>
                                <Link>Go shopping</Link>
                            </NextLink>
                        </Typography>
                    </Box>
                ) : (
                    <>
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="shop__cart__table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Image</th>
                                                <th>Product</th>
                                                <th>Price</th>
                                                <th>Quantity</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cartItems.map((item) => (
                                                <tr>
                                                    <td class="cart__product__item">
                                                        <Image
                                                            src={item.image}
                                                            alt={item.name}
                                                            width={100}
                                                            height={100}
                                                            ></Image>
                                                    </td>
                                                    <td class="cart__product__item">
                                                        <div class="cart__product__item__title">
                                                            <NextLink href={`/product/${item.slug}`} passHref>
                                                                <Link>
                                                                    <h6>{item.name}</h6>
                                                                </Link>
                                                            </NextLink>
                                                            <Rating value={item.rating} readOnly></Rating>
                                                        </div>
                                                    </td>
                                                    <td class="cart__price">${item.price}</td>
                                                    <td class="cart__quantity">
                                                        <div class="pro-qty">
                                                            <Select
                                                                value={item.quantity}
                                                                onChange={(e) =>
                                                                    updateCartHandler(item, e.target.value)
                                                                }
                                                                >
                                                                {[...Array(item.countInStock).keys()].map((x) => (
                                                                    <MenuItem key={x + 1} value={x + 1}>
                                                                    {x + 1}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        </div>
                                                    </td>
                                                    <td class="cart__close">
                                                        <span class="icon_close" 
                                                            onClick={() => removeItemHandler(item)}>
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-lg-6">
                                
                            </div>
                            <div class="col-lg-4 offset-lg-2">
                                <div class="cart__total__procced">
                                    <h6>Cart total</h6>
                                    <ul>
                                        <li>Subtotal <span>({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}
                                        items) : ${' '}
                                        {cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}</span></li>
                                    </ul>
                                    <a href="#" class="primary-btn" 
                                        onClick={() => {
                                            router.push('/shipping');
                                        }}>Proceed to checkout
                                    </a>
                                </div>
                            </div>
                        </div>
                        </>
                    )}
                </div>
            </section>
        </Layout>
    )
}
