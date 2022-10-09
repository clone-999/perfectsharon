import React from 'react'
import Layout from '../components/Layout'
import NextLink from 'next/link';
import { Link } from '@mui/material';

const ContactScreen = () => {
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
                            <span>Contact Us</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <section className="blog-details spad">
            <div className="container">
                <div className="row">
                    <div className="col-lg-6 col-md-6">
                        <div className="contact__content">
                            <div className="contact__address">
                                <h5>Contact info</h5>
                                <ul>
                                    <li>
                                        <h6><i className="fa fa-map-marker"></i> Address</h6>
                                        <p>2302, Concord Tower, Media City, Dubai - UAE</p>
                                    </li>
                                    <li>
                                        <h6><i className="fa fa-phone"></i> Phone</h6>
                                        <p><span>+ (971) 58 578 5297</span></p>
                                    </li>
                                    <li>
                                        <h6><i className="fa fa-headphones"></i> Support</h6>
                                        <p>Support@perfectsharon.com</p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-6 col-md-6">
                        <div className="contact__map">
                            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3613.1195537224826!2d55.15410701448232!3d25.097814041885574!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f6b4164e9f477%3A0x873c65b1c9eb0f7e!2sConcord%20Tower%20-%20Al%20Sufouh%20-%20Al%20Sufouh%202%20-%20Dubai%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2sbd!4v1663154069360!5m2!1sen!2sbd" 
                            height="580" 
                            style={{border: 0}}
                            allowFullScreen>
                            </iframe>
                            
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </Layout>
  )
}

export default ContactScreen