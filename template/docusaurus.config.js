const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');
const { getConfig } = require('./scripts/index.js');
const prebuildPlugin = require('./scripts/prebuildPlugin.js');
const makeFile = require('./scripts/fileMaker.js');

dotenv.config({ path: '../.env' });

// prebuild schemas.json if not exists
const schemasFilePath = path.resolve(__dirname, 'static/schemas.json');

if (!fs.existsSync(schemasFilePath)) {
    console.log('Initializing schemas.json...');
    makeFile(__dirname);
}

const themeConfig = {
    prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme
    }
};

module.exports = getConfig(__dirname, process.env, themeConfig, [prebuildPlugin]);
