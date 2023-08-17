# Tutorial builder

Generator of markdown files for a Docusaurus tutorial website,

## Directory Structure:

```lua
tutorial-builder
  └── src
      ├── browser
      │   └── ... // Browser-specific components
      └── node
          └── ... // Node.js specific utilities
```

## Main Entry Point

In package.json, we set the main field to point to the bundle.js under `dist`. This is the primary entry point to get components.

```json
{
  "main": "dist/bundle.js",
}
```

## Conditional Exports

Node.js introduced a feature called conditional exports that allows defining different entry points based on the environment. This can be helpful if your library has distinct Node and browser entry points.

```json
{
  "exports": {
    ".": "./dist/bundle.js",
    "./utils": "./dist/node/index.js"
  },
}
```

## Webpack

When the library is used in a project that bundles its code with Webpack, Webpack will look for fields like module or browser in package.json to determine the correct entry point.

If you're providing already bundled code for the browser, ensure that you exclude Node.js-specific code from that bundle and vice-versa.

## Peer Dependencies

Docusaurus relies on React, so we list React (and any other such dependencies) as a peer dependency. This ensures that the consuming application uses a single version of React.
