# Tutorial builder

Generator of markdown files for a Docusaurus tutorial website,

## Directory Structure:

```lua
tutorial-builder
    ├──src.
    │   └──node
    │       └── ...   // Node.js specific utilities
    └──browser
        └── ...   // Browser-specific components

```

## Main Entry Point

In package.json, we set the main field to point to the main Node.js entry file. This is the primary entry point for tools like Node.js scripts.

```json
{
  "main": "./src/node/index.js"
}
```

## Module Field

When bundling the browser components with a tool that understands ES modules (like Webpack, Rollup, etc.), we can make use of the module field in package.json. This can point to an ES module entry point.

```json
{
  "module": "./src/browser/index.js"
}

```

## Conditional Exports

Node.js introduced a feature called conditional exports that allows defining different entry points based on the environment. This can be helpful if your library has distinct Node and browser entry points

```json
{
  "exports": {
    "require": "./src/node/index.js",
    "import": "./src/browser/index.js"
  }
}
```

## Webpack

When the library is used in a project that bundles its code with Webpack, Webpack will look for fields like module or browser in package.json to determine the correct entry point.

If you're providing already bundled code for the browser, ensure that you exclude Node.js-specific code from that bundle and vice-versa.

## Peer Dependencies

Docusaurus relies on React, so we list React (and any other such dependencies) as a peer dependency. This ensures that the consuming application uses a single version of React.
