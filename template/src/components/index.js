import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

export const Gallery = (props) => {
    return (
        <BrowserOnly fallback={<div>Loading...</div>}>
            {() => {
                const Gallery = require('@uniwebcms/tutorial-builder').Gallery;
                return <Gallery {...props} />;
            }}
        </BrowserOnly>
    );
};
