// Use Conditional Exports (takes it from /node automatically in nodejs context
const { getSidebars } = require('@uniwebcms/tutorial-builder');

module.exports = getSidebars(__dirname);
