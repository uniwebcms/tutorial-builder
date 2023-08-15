const dotenv = require('dotenv');
const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');
const { getConfig } = require('./scripts/index.js');
const prebuildPlugin = require('./scripts/prebuildPlugin.js');

dotenv.config({ path: '../.env' });

const themeConfig = {
    prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme
    }
};

module.exports = getConfig(__dirname, process.env, themeConfig, [prebuildPlugin]);
