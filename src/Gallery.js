import React from 'react';
import { Gallery, Item } from 'react-photoswipe-gallery';
import 'photoswipe/dist/photoswipe.css';

/**
 * Gallery of component preview images.
 * @param {Array} images - Array of image objects. Each object should have the following properties: [src, width, height]
 * @returns
 */
export default function ({ images }) {
    return (
        <Gallery id='image-gallery'>
            <div className='imageGallery'>
                {images.map((image, index) => {
                    const [src, width, height] = image;

                    return (
                        <Item key={index} original={src} thumbnail={src} width={width} height={height}>
                            {({ ref, open }) => <img ref={ref} onClick={open} src={src} />}
                        </Item>
                    );
                })}
            </div>
        </Gallery>
    );
}
