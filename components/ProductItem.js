import { Link, Rating } from '@mui/material';
import NextLink from 'next/link';
import React from 'react';
import { urlForThumbnail } from '../utils/image';

export default function ProductItem({ product, addToCartHandler }) {
  return (
    <div className="product__item">
      <div className="product__item__pic set-bg" 
          style={{
              backgroundImage: "url(" + urlForThumbnail(product.image) + ")",
              backgroundPosition: 'center',
              backgroundSize: 'cover',
          }}
          data-setbg="">
          <ul className="product__hover">
              <li>
                <NextLink href={`/product/${product.slug.current}`} passHref>
                  <Link className="image-popup"><span className="arrow_expand"></span></Link>
                </NextLink>
              </li>
              <li>
                <NextLink href="#" passHref>
                  <Link onClick={() => addToCartHandler(product)}><span className="icon_bag_alt"></span></Link>
                </NextLink>
              </li>
          </ul>
      </div>
      <div className="product__item__text">
          <h6>
            <NextLink href={`/product/${product.slug.current}`} passHref>
              <Link href="#">{product.name}</Link>
            </NextLink>
          </h6>
          <div className="rating">
            <Rating value={product.rating} readOnly></Rating>
          </div>
          <div className="product__price">${product.price}</div>
      </div>
  </div>
  )
}
