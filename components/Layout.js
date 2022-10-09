import { createTheme } from '@mui/material/styles';
import {
    Box,
    Button,
    Divider,
    Drawer,
    IconButton,
    InputBase,
    Link,
    List,
    ListItem,
    ListItemText,
    Menu,
    MenuItem,
    ThemeProvider,
    Typography,
    useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import CancelIcon from '@mui/icons-material/Cancel';
import Head from 'next/head';
import NextLink from 'next/link';
import classes from '../utils/classes';
import { useContext, useEffect, useState } from 'react';
import { Store } from '../utils/Store';
import jsCookie from 'js-cookie';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { getError } from '../utils/error';

export default function Layout({ title, description, children }) {
    const router = useRouter();
    const { state, dispatch } = useContext(Store);
    const { darkMode, cart, userInfo } = state;
    const theme = createTheme({
        components: {
        MuiLink: {
            defaultProps: {
            underline: 'hover',
            },
        },
        },
        typography: {
        h1: {
            fontSize: '1.6rem',
            fontWeight: 400,
            margin: '1rem 0',
        },
        h2: {
            fontSize: '1.4rem',
            fontWeight: 400,
            margin: '1rem 0',
        },
        },
        palette: {
        mode: darkMode ? 'dark' : 'light',
        primary: {
            main: '#ca1515',
        },
        secondary: {
            main: '#208080',
        },
        },
    });
    
    const [anchorEl, setAnchorEl] = useState(null);
    const loginMenuCloseHandler = (e, redirect) => {
        if (redirect && redirect == "backdropClick"){
            setAnchorEl(null);
            return;
        }
        setAnchorEl(null);
        if (redirect) {
            router.push(redirect);
        }
    };
    const loginClickHandler = (e) => {
        setAnchorEl(e.currentTarget);
    };
    const logoutClickHandler = () => {
        setAnchorEl(null);
        dispatch({ type: 'USER_LOGOUT' });
        jsCookie.remove('userInfo');
        jsCookie.remove('cartItems');
        jsCookie.remove('shippingAddress');
        jsCookie.remove('paymentMethod');
        router.push('/');
    };

    const [sidbarVisible, setSidebarVisible] = useState(false);
    const [menubarVisible, setMenubarVisible] = useState(false);

    const sidebarOpenHandler = () => {
        setSidebarVisible(true);
    };
    const sidebarCloseHandler = () => {
        setSidebarVisible(false);
    };

    const menubarOpenHandler = () => {
        setMenubarVisible(true);
    };
    const menubarCloseHandler = () => {
        setMenubarVisible(false);
    };

    const { enqueueSnackbar } = useSnackbar();
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        const fetchCategories = async () => {
        try {
            const { data } = await axios.get(`/api/products/categories`);
            setCategories(data);
        } catch (err) {
            enqueueSnackbar(getError(err), { variant: 'error' });
        }
        };
        fetchCategories();
    }, [enqueueSnackbar]);

    const isDesktop = useMediaQuery('(min-width:600px)');

    const [query, setQuery] = useState('');
    const queryChangeHandler = (e) => {
        setQuery(e.target.value);
    };
    const submitHandler = (e) => {
        e.preventDefault();
        router.push(`/search?query=${query}`);
    };

    return (
        <>
            <Head>
                <title>{title ? `${title} - Perfect Sharon` : 'Perfect Sharon'}</title>
                {description && <meta name="description" content={description}></meta>}
            </Head>
            <ThemeProvider theme={theme}>
                
                <header className="header">
                    <div className="container-fluid">
                        <div className="row">
                            <div className={isDesktop ? "col-xl-1 col-lg-2" : "col-xl-3 col-lg-4"}>
                                <IconButton
                                    edge="start"
                                    aria-label="open drawer"
                                    onClick={sidebarOpenHandler}
                                    sx={classes.menuButton}
                                >
                                <MenuIcon sx={classes.navbarButton} />
                            </IconButton>
                            </div>
                            <div className={isDesktop ? "col-xl-3 col-lg-2" : "col-xl-7 col-lg-8"}>
                                <div className="header__logo">
                                    <NextLink href="/" passHref>
                                        <Link>
                                            <img src="/front/img/logo.png" alt="" width={100}/>
                                        </Link>
                                    </NextLink>
                                </div>
                            </div>
                            <div className="col-xl-2 col-lg-3">
                                <nav className="header__menu">
                                    <ul>
                                        <li className="active">
                                            <NextLink href="/" passHref>
                                                <Link>
                                                    Home
                                                </Link>
                                            </NextLink>
                                        </li>
                                        <li className="">
                                            <NextLink href="/search" passHref>
                                                <Link>
                                                    Shop
                                                </Link>
                                            </NextLink>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                            <div className="col-xl-3 col-lg-4">
                                <Box sx={isDesktop ? classes.visible : classes.hidden}>
                                    <form onSubmit={submitHandler}>
                                        <Box sx={classes.searchForm}>
                                            <InputBase
                                                name="query"
                                                sx={classes.searchInput}
                                                placeholder="Search products"
                                                onChange={queryChangeHandler}
                                            />
                                            <IconButton
                                                type="submit"
                                                sx={classes.searchButton}
                                                aria-label="search"
                                            >
                                                <SearchIcon 
                                                    style={{color: 'white'}} />
                                            </IconButton>
                                        </Box>
                                    </form>
                                </Box>
                            </div>
                            <div className="col-lg-3">
                                <div className="header__right">
                                    <div className="header__right__auth">
                                        {userInfo ? (
                                            <>
                                            <Button
                                                aria-controls="simple-menu"
                                                aria-haspopup="true"
                                                sx={classes.navbarButton}
                                                onClick={loginClickHandler}
                                            >
                                                {userInfo.name}
                                            </Button>
                                            <Menu
                                                id="simple-menu"
                                                anchorEl={anchorEl}
                                                keepMounted
                                                open={Boolean(anchorEl)}
                                                onClose={loginMenuCloseHandler}
                                            >
                                                <MenuItem
                                                onClick={(e) => loginMenuCloseHandler(e, '/profile')}
                                                >
                                                Profile
                                                </MenuItem>
                                                <MenuItem
                                                onClick={(e) =>
                                                    loginMenuCloseHandler(e, '/order-history')
                                                }
                                                >
                                                Order History
                                                </MenuItem>
                                                <MenuItem onClick={logoutClickHandler}>Logout</MenuItem>
                                            </Menu>
                                            </>
                                        ) : (
                                            <NextLink href="/login" passHref>
                                            <Link>Login</Link>
                                            </NextLink>
                                        )}
                                    </div>
                                    <ul className="header__right__widget">
                                        <NextLink href="/cart" passHref>
                                            <li>
                                                {cart.cartItems.length > 0 ? (
                                                    <Link><span className="icon_bag_alt"></span>
                                                        <div className="tip">{cart.cartItems.length}</div>
                                                    </Link>
                                                    ) : (
                                                    'Cart'
                                                )}
                                            </li>
                                        </NextLink>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <Drawer
                            anchor="left"
                            open={sidbarVisible}
                            onClose={sidebarCloseHandler}
                            >
                            <List>
                                <ListItem>
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="space-between"
                                >
                                    <Typography>Shopping by category</Typography>
                                    <IconButton
                                        aria-label="close"
                                        onClick={sidebarCloseHandler}
                                    >
                                    <CancelIcon />
                                    </IconButton>
                                </Box>
                                </ListItem>
                                <Divider light />

                                {categories.map((category) => (
                                    <NextLink
                                        key={category}
                                        href={`/search?category=${category}`}
                                        passHref
                                    >
                                        <ListItem
                                        button
                                        component="a"
                                        onClick={sidebarCloseHandler}
                                        >
                                        <ListItemText primary={category}></ListItemText>
                                        </ListItem>
                                    </NextLink>
                                ))}

                                <ListItem component="a">
                                    <NextLink href="/cart" passHref>
                                        <Link>
                                        {cart.cartItems.length > 0 ? (
                                            <>
                                                <span className="icon_bag_alt"></span>
                                                <div className="tip">{cart.cartItems.length}</div>
                                            </>
                                            ) : (
                                            <ListItemText primary="Cart"></ListItemText>
                                        )}
                                        </Link>
                                    </NextLink>
                                </ListItem>

                                {userInfo ? (
                                    <>
                                    <ListItem>
                                        <Typography>{userInfo.name}</Typography>
                                    </ListItem>
                                    <ListItem
                                    onClick={(e) => loginMenuCloseHandler(e, '/profile')}
                                    >
                                    Profile
                                    </ListItem>
                                    <ListItem
                                    onClick={(e) =>
                                        loginMenuCloseHandler(e, '/order-history')
                                    }
                                    >
                                    Order History
                                    </ListItem>
                                    <ListItem onClick={logoutClickHandler}>Logout</ListItem>
                                    </>
                                ) : (
                                    <ListItem>
                                        <NextLink href="/login" passHref>
                                            <Link>Login</Link>
                                        </NextLink>
                                    </ListItem>
                                )}
                                
                            </List>
                        </Drawer>
                    </div>
                </header>
                {children}

                <section className="services spad">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-3 col-md-4 col-sm-6">
                                <div className="services__item">
                                    <i className="fa fa-car"></i>
                                    <h6>Free Shipping</h6>
                                    <p>For all oder over $99</p>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-4 col-sm-6">
                                <div className="services__item">
                                    <i className="fa fa-money"></i>
                                    <h6>Money Back Guarantee</h6>
                                    <p>If good have Problems</p>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-4 col-sm-6">
                                <div className="services__item">
                                    <i className="fa fa-support"></i>
                                    <h6>Online Support 24/7</h6>
                                    <p>Dedicated support</p>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-4 col-sm-6">
                                <div className="services__item">
                                    <i className="fa fa-headphones"></i>
                                    <h6>Payment Secure</h6>
                                    <p>100% secure payment</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="instagram">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-lg-2 col-md-4 col-sm-4 p-0">
                                <div className="instagram__item set-bg"
                                    style={{
                                        backgroundImage: "url(/front/img/instagram/insta-1.jpg)",
                                        backgroundPosition: 'center',
                                        backgroundSize: 'cover',
                                    }}>
                                    <div className="instagram__text">
                                        <i className="fa fa-instagram"></i>
                                        <a href="#">@ perfect_sharon</a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-4 col-sm-4 p-0">
                                <div className="instagram__item set-bg" 
                                    style={{
                                        backgroundImage: "url(/front/img/instagram/insta-2.jpg)",
                                        backgroundPosition: 'center',
                                        backgroundSize: 'cover',
                                    }}>
                                    <div className="instagram__text">
                                        <i className="fa fa-instagram"></i>
                                        <a href="#">@ perfect_sharon</a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-4 col-sm-4 p-0">
                                <div className="instagram__item set-bg" 
                                    style={{
                                        backgroundImage: "url(/front/img/instagram/insta-3.jpg)",
                                        backgroundPosition: 'center',
                                        backgroundSize: 'cover',
                                    }}>
                                    <div className="instagram__text">
                                        <i className="fa fa-instagram"></i>
                                        <a href="#">@ perfect_sharon</a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-4 col-sm-4 p-0">
                                <div className="instagram__item set-bg" 
                                    style={{
                                        backgroundImage: "url(/front/img/instagram/insta-4.jpg)",
                                        backgroundPosition: 'center',
                                        backgroundSize: 'cover',
                                    }}>
                                    <div className="instagram__text">
                                        <i className="fa fa-instagram"></i>
                                        <a href="#">@ perfect_sharon</a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-4 col-sm-4 p-0">
                                <div className="instagram__item set-bg" 
                                    style={{
                                        backgroundImage: "url(/front/img/instagram/insta-5.jpg)",
                                        backgroundPosition: 'center',
                                        backgroundSize: 'cover',
                                    }}>
                                    <div className="instagram__text">
                                        <i className="fa fa-instagram"></i>
                                        <a href="#">@ perfect_sharon</a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-4 col-sm-4 p-0">
                                <div className="instagram__item set-bg" 
                                    style={{
                                        backgroundImage: "url(/front/img/instagram/insta-6.jpg)",
                                        backgroundPosition: 'center',
                                        backgroundSize: 'cover',
                                    }}>
                                    <div className="instagram__text">
                                        <i className="fa fa-instagram"></i>
                                        <a href="#">@ perfect_sharon</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <footer className="footer">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-4 col-md-6 col-sm-7">
                                <div className="footer__about">
                                    <div className="footer__logo">
                                        <a href="#">
                                            <img src="/front/img/logo.png" alt="" />
                                        </a>
                                    </div>
                                    <p>Designed to reflect a modern take on women’s underwear with the focus of offering simple and sporty-style bikinis that are comfortable, affordable, attractive and pleasant manner.</p>
                                    <div className="footer__payment">
                                        <a href="#"><img src="/front/img/payment/payment-1.png" alt="" /></a>
                                        <a href="#"><img src="/front/img/payment/payment-2.png" alt="" /></a>
                                        <a href="#"><img src="/front/img/payment/payment-3.png" alt="" /></a>
                                        <a href="#"><img src="/front/img/payment/payment-4.png" alt="" /></a>
                                        <a href="#"><img src="/front/img/payment/payment-5.png" alt="" /></a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-3 col-sm-5">
                                <div className="footer__widget">
                                    <h6>Quick links</h6>
                                    <ul>
                                        <li>
                                            <NextLink href="/search" passHref>
                                                <Link>
                                                    Shop
                                                </Link>
                                            </NextLink>
                                        </li>
                                        <li>
                                            <NextLink href="/cart" passHref>
                                                <Link>
                                                    Cart
                                                </Link>
                                            </NextLink>
                                        </li>
                                        <li>
                                            <NextLink href="/about" passHref>
                                                <Link>
                                                    About
                                                </Link>
                                            </NextLink>
                                        </li>
                                        <li>
                                            <NextLink href="/contact" passHref>
                                                <Link>
                                                    Contact Us
                                                </Link>
                                            </NextLink>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-3 col-sm-4">
                                <div className="footer__widget">
                                    <h6>Account</h6>
                                    
                                        {userInfo ? (
                                            <ul>
                                                <li>
                                                    <NextLink href="/profile" passHref>
                                                        <Link>My Account</Link>
                                                    </NextLink>
                                                </li>
                                                <li>
                                                    <NextLink href="/order-history" passHref>
                                                        <Link>My Order History</Link>
                                                    </NextLink>
                                                </li>
                                                <li>
                                                    <a href="#" onClick={logoutClickHandler}>Checkout</a>
                                                </li>
                                            </ul>
                                        ) : (
                                            <ul>
                                                <li>
                                                    <NextLink href="/login" passHref>
                                                        <Link>Login</Link>
                                                    </NextLink>
                                                </li>
                                                <li>
                                                    <NextLink href="/register" passHref>
                                                        <Link>Register</Link>
                                                    </NextLink>
                                                </li>
                                            </ul>
                                        )}
                                    
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-8 col-sm-8">
                                <div className="footer__newslatter">
                                    <h6>NEWSLETTER</h6>
                                    <form action="#">
                                        <input type="text" placeholder="Email" />
                                        <button type="submit" className="site-btn">Subscribe</button>
                                    </form>
                                    <div className="footer__social">
                                        <a href="#"><i className="fa fa-facebook"></i></a>
                                        <a href="#"><i className="fa fa-twitter"></i></a>
                                        <a href="#"><i className="fa fa-youtube-play"></i></a>
                                        <a href="#"><i className="fa fa-instagram"></i></a>
                                        <a href="#"><i className="fa fa-pinterest"></i></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="footer__copyright__text">
                                    <p>Copyright &copy; {new Date().getFullYear()} All rights reserved | This is made with <i className="fa fa-heart" aria-hidden="true"></i> by <a href="#" target="_blank">David</a></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </ThemeProvider>
        </>
    );
}