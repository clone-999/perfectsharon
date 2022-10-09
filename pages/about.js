import React from 'react'
import Layout from '../components/Layout'
import NextLink from 'next/link';
import { Link } from '@mui/material';

const AboutScreen = () => {
  return (
    <Layout>
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
                            <span>About Us</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <section class="blog-details spad">
            <div class="container">
                <div class="row">
                    <div class="col-lg-8 col-md-8">
                        <div class="blog__details__content">
                            <div class="blog__details__desc">
                                <p>Perfect Sharon was designed to reflect a modern take on women’s underwear with the focus of offering simple and sporty-style bikinis that are comfortable, affordable, attractive and pleasant manner. </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </Layout>
  )
}

export default AboutScreen