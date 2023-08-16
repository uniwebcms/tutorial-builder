const makeFile = require('./fileMaker.js');
const path = require('path');
const { globSync } = require('glob');
const fs = require('fs');

let buildCounter = 0;

// Function to get the most recent modification time
function getLastModTime(pattern) {
    const files = globSync(pattern);

    let latestDate = new Date(0); // Initialize with earliest possible date

    for (const file of files) {
        const stats = fs.statSync(file);
        if (stats.mtime > latestDate) latestDate = stats.mtime;
    }

    return latestDate.getTime();
}

//https://docusaurus.io/docs/api/plugin-methods
// type LoadContext = {
//     siteDir: string;
//     generatedFilesDir: string;
//     siteConfig: DocusaurusConfig;
//     outDir: string;
//     baseUrl: string;
//   };
async function PrebuildPlugin(context, opts) {
    return {
        // A compulsory field used as the namespace for directories to cache
        // the intermediate data for each plugin.
        // If you're writing your own local plugin, you will want it to
        // be unique in order not to potentially conflict with imported plugins.
        // A good way will be to add your own project name within.
        name: 'prebuild-plugin',

        async loadContent() {
            const srcDir = path.resolve(context.siteDir, '../src');
            const docsDir = path.resolve(context.siteDir, 'docs');
            const src = `${srcDir}/*/docs/**/*.{yml,png,jpg}`;
            const docs = `${docsDir}/**/*.{yml,mdx}`;

            if (!buildCounter || getLastModTime(src) >= getLastModTime(docs)) {
                buildCounter++;
                console.log(`Rebuilding markdown content (#${buildCounter})...`);
                makeFile(context.siteDir);
            }
        },

        getPathsToWatch() {
            // https://docusaurus.io/docs/api/plugin-methods/extend-infrastructure
            // Paths to watch.
            console.log('File changes detected.');
            // console.log(path.resolve(context.siteDir, '../src'));
            const srcDir = path.resolve(context.siteDir, '../src');

            return [`${srcDir}/*/docs/**/*.{yml,png,jpg}`];
        }
    };
}

// PrebuildPlugin.validateOptions = ({ options, validate }) => {
//     const validatedOptions = validate(myValidationSchema, options);
//     return validatedOptions;
// };

// PrebuildPlugin.validateThemeConfig = ({ themeConfig, validate }) => {
//     const validatedThemeConfig = validate(myValidationSchema, options);
//     return validatedThemeConfig;
// };

module.exports = PrebuildPlugin;
