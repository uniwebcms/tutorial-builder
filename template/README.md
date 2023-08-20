# Docusaurus Website for Uniweb Modules

Auto generated tutorial website for Uniweb modules.

## Prerequisites

- Node.js (version 16.14 or higher)
- npm (Node Package Manager) or Yarn

## Getting Started

In the standard use case, one creates a Uniweb modules project from a GitHub repo template. The template should include a copy of this tutorial website. Alternatively, you can [create a tutorial website manually](#manual-installation).

The files under the tutorial website project don't need to be modified manually. The **build script** generates and updates all that is needed.

## Project Structure

The website project structure looks like this:

```lua
tutorial
    ├── README.md
    ├── babel.config.js
    ├── docs -- Auto generated contents. Don't add files here.
    ├── docusaurus.config.js -- Generates a config using the tutorial-builder library
    ├── package.json
    ├── src
    │   ├── components -- Add custom components here [not supported yet]
    │   │   └── index.js -- Example file name [not implemented yet]
    │   ├── css
    │   │   └── custom.css
    │   └── pages
    │       └── index.mdx
    └── static
        └── img
            ├── favicon.png
            ├── logo.svg
            └── logo_light.svg
```

- The `docs` directory contains the auto-generated documentation files for the tutorial website. They don't need to be committed since they are always regenerated at build time.
- The `src` directory contains the css file, pages, and component ([read more](#custom-components)).
- The `static` directory contains the static assets files such as image and json files.
- The `docusaurus.config.js` file is the configuration file for Docusaurus.

## Auto generation of markdown files

The markdown files for the tutorial website are build from YAML files and screenshot images located in the parent directory of the tutorial folder.

Each module under `uniweb-modules-repo/src` is expected to document only the components that it exports. Internal components can be documented using repo-level markdown files rather than pages of the tutorial website. Moreover, the explanations of exported components are meant to be read by non-technical individuals rather than developers.

```lua
uniweb-modules-repo
    ├── ...
    ├── src
│   │   ├── ModuleName1 -- Source code and tutorial docs of module
    │   │   ├── components -- Source code of components
    │   │   │   └── ...
    │   │   ├── docs
    │   │   │   └── ComponentName1 -- Documentation files and images
    │   │   │   │   ├── schema.yml -- YAML file with documentation info
    │   │   │   │   └── gallery1.png -- Image for the gallery (any name is okay)
    │   │   │   ├── ComponentName2
│   │   │   │   └── ...
    │   ├── ModuleName2
    │   └── ...
    └── tutorial -- This tutorial website
        └── ... 
```

## Local Development

To start a local development server and preview your tutorial website, run the following commands:

```bash
cd my-tutorial-website
npm install
npm start
# OR
yarn install
yarn start
```

### Build and serve locally for testing

```bash
cd my-tutorial-website
npm run build:dev
npm run serve:dev
# OR
yarn build:dev
yarn serve:dev
```

The built website will be available in the `build` under `my-tutorial-website` directory.

This will start the development server, and you can view the website at `http://localhost:3000`.

## Building for Production
To build the website for production, you have the following two options:

### Build and locally and commit manually

```bash
cd my-tutorial-website
npm run build:prod
# OR
yarn build:prod
```

The built website will be available in the `dist` under the project root directory, you can them manually commit it.

### Build using GitHub Actions workflow

```bash
cd my-tutorial-website
npm run build:gh
# OR
yarn build:gh
```

This script should be used in a workflow executed by GitHub Actions to provide the necessary environment variables. The built website will be available in the `dist` directory under the project's root. Once the build artifact is uploaded to GitHub Pages, the website can be visited via the GitHub Pages URL.

## Manual installation

It is possible to create a new tutorial website from scratch using the  command:

```bash
npx @uniwebcms/tutorial-builder@latest init [project-name]
```

The command initializes a new tutorial website project in the `project-name` directory under your project root. The <b>\`project-name\`</b> argument is optional. If you don't provide a project name, the default name `tutorial` will be used.

Alternatively, you can install all from scratch with

```bash
cd tutorial && yarn add @docusaurus/core@latest @docusaurus/mdx-loader@latest @docusaurus/preset-classic@latest @uniwebcms/tutorial-builder
```

And then change the default code in `docusaurus.config.js` to the following code:

```javascript
const dotenv = require('dotenv');
const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');
const getConfig = require('@uniwebcms/tutorial-builder/config');

dotenv.config({ path: '../.env' });

const themeConfig = {
    prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme
    }
};

module.exports = getConfig(process.env, themeConfig);
```

## Custom components

The markdown files under the `docs` folder are created programmatically using template files.
At this point, we don't accept alternative templates. If we did that in the future, the templates given will be able to use custom React components in the documentation pages. Such components can be placed under `src/components/index.js` and then imported as

```javascript
import { CompName } from '@site/src/components';
```

In some cases, a component might depend on a library that tis not compatible with server-side rendering (SSR). In that case, the proper way to import the component is:

```javascript
import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

export const Gallery = ({ images }) => {
    return (
        <BrowserOnly fallback={<div>Loading...</div>}>
            {() => {
                const CompName = require('@site/src/components').CompName;
                return <CompName images={images} />;
            }}
        </BrowserOnly>
    );
};

```

## Contributing

We welcome contributions to website-builder. Feel free to submit bug reports, feature requests, or pull requests on our [GitHub repository](https://github.com/uniwebcms).

## License

This project is licensed under the MIT License.
