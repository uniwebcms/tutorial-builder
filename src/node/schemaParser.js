const fs = require('fs');
const path = require('path');

function readSchemas() {
    const output = {};

    const rootDir = path.resolve(process.cwd(), 'static', 'modules');

    const modules = fs.readdirSync(rootDir);

    for (const module of modules) {
        const schema = path.resolve(rootDir, module, 'schema.json');
        const content = fs.readFileSync(schema, 'utf8');

        output[module] = JSON.parse(content);
    }

    return output;
}

module.exports = readSchemas;
