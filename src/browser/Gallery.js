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

// Below is an attempt to eliminate the need for the <BrowserOnly/> wrapper within the user's tutorial project.

// import React from 'react';
// import 'photoswipe/dist/photoswipe.css';
// import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

// if (ExecutionEnvironment.canUseDOM) {
//   require('lib-that-only-works-client-side');
// }

// /**
//  * Logic to avoid React hydration problems. It eliminate the need for the 
//  * <BrowserOnly/> wrapper within the user's tutorial project.
//  *
//  * The Gallery component can't run on server-side rendering (SSR) mode
//  * used by Docusaurus to convert a React website to a static version.
//  * This custom hook checks that the current environment is not SSR.
//  * There is also a different approach of creating a ClientOnly wrapper
//  * instead of the custom hook. Both are described in the article below.
//  *
//  * @see https://www.joshwcomeau.com/react/the-perils-of-rehydration/#abstractions
//  *
//  * On first client-side render, we need to render exactly as the server rendered
//  * isBrowser is set to true only after a successful hydration.
//  * 
//  * Note that even importing the library is not SSR compatible, so the library
//  * is added dynamically on mount, which doesn't happen on SSR mode.
//  *
//  * @see https://github.com/facebook/docusaurus/blob/main/packages/docusaurus/src/client/browserContext.tsx
//  *
//  * @returns {boolean} - true iff the component is mounted, which means that
//  * it's in browser mode.
//  */
// function useGetComponents() {
//     const [components, setComponents] = React.useState(null);

//     React.useEffect(() => {
//         setComponents(require('react-photoswipe-gallery'));
//     }, []);

//     return components;
// }

// /**
//  * Gallery of component preview images.
//  * @param {Array} images - Array of image objects. Each object should 
//  * have the following properties: [src, width, height]
//  * @returns {function} A React Gallery component.
//  */
// export default function ({ images }) {
//     const components = useGetComponents();

//     if (!components) {
//         return null;
//     }

//     const { Gallery, Item } = components;

//     return (
//         <Gallery id="image-gallery">
//             <div className="imageGallery">
//                 {images.map((image, index) => {
//                     const [src, width, height] = image;

//                     return (
//                         <Item key={index} original={src} thumbnail={src} width={width} height={height}>
//                             {({ ref, open }) => <img ref={ref} onClick={open} src={src} />}
//                         </Item>
//                     );
//                 })}
//             </div>
//         </Gallery>
//     );
// }
