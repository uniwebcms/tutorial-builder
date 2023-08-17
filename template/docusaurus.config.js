const dotenv = require('dotenv');
const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');
// Use Conditional Exports (takes it from /node automatically in nodejs context)
const { getConfig } = require('@uniwebcms/tutorial-builder');

dotenv.config({ path: '../.env' });

const themeConfig = {
    prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme
    }
};

module.exports = getConfig(__dirname, process.env, themeConfig);
