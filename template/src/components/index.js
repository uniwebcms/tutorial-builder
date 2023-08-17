import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

// To do: I think that the following line should work fine but I'm not sure.
// import {Gallery} from '@uniwebcms/tutorial-builder';
// In fact, we might not need this file if the import work. We can set the
// proper import in component_template.mdx and intro_template.mdx. 
// In those templates, the line
// import {Gallery} from '@site/src/components/index.js'; 
// can become
// import {Gallery} from '@uniwebcms/tutorial-builder';

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
