const fs = require('fs');
const path = require('path');

function readSchemas(rootDir) {
    const filePath = path.resolve(rootDir, 'static/schemas.json');

    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

module.exports = readSchemas;
