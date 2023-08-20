const readSchemas = require('./schemaParser.js');

function getSidebars() {
    const schemas = readSchemas();
    const sidebars = {};

    for (let key in schemas) {
        sidebars[key] = [{ type: 'autogenerated', dirName: key }];
    }

    return sidebars;
}

module.exports = getSidebars();
