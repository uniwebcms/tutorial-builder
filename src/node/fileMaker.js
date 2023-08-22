#!/usr/bin/env node

// This is a Node.js script that you'd run before building your Docusaurus site.
const sizeOf = require('image-size');
const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');

const autoSchema = loadYaml(__dirname + '/auto_schema.yml');
const componentTemplate = fs.readFileSync(__dirname + '/component_template.mdx', 'utf8');
const introTemplate = fs.readFileSync(__dirname + '/intro_template.mdx', 'utf8');

function loadYaml(fullPath) {
    // Read YAML file and convert YAML content to JS object
    return yaml.load(fs.readFileSync(fullPath, 'utf8'));
}

function splitPath(str) {
    return path
        .normalize(str)
        .replace(/^\/|\/$/g, '')
        .split(path.sep);
}

function generateMarkdownTable(data, columnMap) {
    const order = Object.keys(columnMap);
    const headers = order.map((key) => columnMap[key]);
    const separator = headers.map(() => '-').join(' | ');

    const rows = [];

    for (const key in data) {
        const row = order.map((col) => {
            if (col === '$') return key;

            let val = data[key][col];

            if (val && (col == 'type' || col == 'layout')) val = formatKeywords(val);

            return val;
        });

        rows.push(row.join(' | '));
    }

    return `${headers.join(' | ')}\n${separator}\n${rows.join('\n')}`;
}

/**
 * Recursively scans a directory for files with specific extensions.
 *
 * @example
 * const directoryToScan = './your-directory';
 * const desiredExtensions = ['.png', '.jpg'];
 *
 * @param {string} dir - The directory to start the scan from.
 * @param {string[]} extensions - The list of file extensions to match.
 * @returns {string[]} - An array of relative paths of the matched files.
 */
function scanDirectory(dir, extensions) {
    let results = [];

    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            results = results.concat(scanDirectory(fullPath, extensions));
        } else if (extensions.includes(path.extname(file))) {
            results.push(fullPath);
        }
    }

    return results;
}

function loadSchemas(sourceDir) {
    const files = scanDirectory(sourceDir, ['.yml']);
    const modules = {};

    for (const fullPath of files) {
        const relPath = path.relative(sourceDir, fullPath);
        const levels = splitPath(relPath);

        if (levels.length < 2 || levels[1] != 'docs') continue;

        const data = loadYaml(fullPath);

        const imgDir = path.dirname(fullPath);
        const imgPaths = scanDirectory(imgDir, ['.png', '.jpg']);
        data.images = [];

        for (const imgPath of imgPaths) {
            const dimensions = sizeOf(imgPath);
            const key = path.relative(imgDir, imgPath);
            const relPath = path.relative(sourceDir, imgPath);
            data.images.push({ key, ...dimensions, path: relPath });
        }

        data.module = levels[0];
        data.name = levels[2];

        modules[data.module] ??= {};
        modules[data.module][data.name] ??= data;
    }

    return modules;
}

function initDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function deleteDirectoryContents(dirPath) {
    // Make sure that the directory exists since the goal
    // is to leave it empty but existing
    initDir(dirPath);

    // Get all files and directories within the directory
    const items = fs.readdirSync(dirPath);

    for (const item of items) {
        const itemPath = path.join(dirPath, item);

        // Check if it's a directory
        const stat = fs.statSync(itemPath);
        if (stat.isDirectory()) {
            // If it's a directory, first delete its contents
            deleteDirectoryContents(itemPath);

            // Then delete the directory itself
            fs.rmdirSync(itemPath);
        } else {
            // If it's a file, delete it
            fs.unlinkSync(itemPath);
        }
    }
}

function insertIntoMarkdown(template, contentMap) {
    // Replace placeholders
    for (const placeholder in contentMap) {
        template = template.replace(`{{${placeholder}}}`, contentMap[placeholder]);
    }

    return template;
}

function formatKeywords(input) {
    if (typeof input == 'string') input = input.split(',');

    return Array.isArray(input)
        ? input
              .map((value) => value.trim()) // Trim whitespace around each element
              .map((value) => `\`${value}\``) // Wrap each element with backticks
              .join('<br />')
        : input; // Join them back with a comma and a space
}

function autoCompleteElements(elements, template) {
    if (Array.isArray(elements)) {
        elements = Object.fromEntries(elements.map((key) => [key, null]));
    }

    const autoElements = template.elements || {};

    for (const key in elements) {
        elements[key] ??= {};

        if (autoElements[key]) {
            const elem = elements[key];
            const auto = autoElements[key];

            for (const prop in auto) {
                if (!elem[prop]) elem[prop] = auto[prop];
            }
        }
    }
}

function autoCompleteComponents(components) {
    for (const componentName in components) {
        const component = components[componentName];

        autoCompleteElements(component.elements, autoSchema);
    }
}

function renderComponentDoc(component, docsDir) {
    let gallery = '';
    const imgImport = [];

    let compDir = path.resolve(docsDir, component.module);
    let template = introTemplate;
    let filePath = path.resolve(compDir, `intro.mdx`);

    if (component.name != '_self') {
        compDir += '/Components';
        template = componentTemplate;
        filePath = path.resolve(compDir, `${component.name}.mdx`);
    }

    if (component.images && component.images.length) {
        let items = [];
        let imgIdx = 1;

        for (const img of component.images) {
            const imgName = 'img' + imgIdx++;

            imgImport.push(`import ${imgName} from '@site/static/modules/${img.path}';`);

            items.push(`[${imgName}, ${img.width}, ${img.height}]`);
        }

        items = items.join(', ');

        // gallery = `<Gallery images={[${items}]}/>`;
        gallery = `<BrowserOnly fallback={<div>Loading...</div>}>
            {() => {
                const Gallery = require('@uniwebcms/tutorial-builder').Gallery;
                return <Gallery images={[${items}]} />;
            }}
        </BrowserOnly>`;
    }

    let description = component.description;

    if (component.example) {
        const url = new URL(component.example);

        description += `\n## Demo\n[${url.hostname}](${component.example})`;
    }

    const propertyTable = component.properties ? generateMarkdownTable(component.properties, autoSchema.propertyColumns) : 'There are no customizable properties.';

    const map = {
        name: component.name,
        description,
        gallery,
        imgImport: imgImport.join(';\n'),
        elementTable: generateMarkdownTable(component.elements, autoSchema.elementColumns),
        propertyTable
    };

    initDir(compDir);

    fs.writeFileSync(filePath, insertIntoMarkdown(template, map), 'utf-8');
}

const generateProjectFiles = (rootDir = process.cwd()) => {
    const sourceDir = path.resolve(rootDir, '../src');
    const docsDir = path.resolve(rootDir, 'docs');
    const publicDir = path.resolve(rootDir, 'static', 'modules');
    const modules = loadSchemas(sourceDir);

    deleteDirectoryContents(docsDir);
    deleteDirectoryContents(publicDir);

    for (const moduleName in modules) {
        // Create the Components directory and _category_.yml for each module
        const compDir = path.resolve(docsDir, moduleName, 'Components');
        initDir(compDir);
        fs.writeFileSync(compDir + '/_category_.yml', 'collapsed: false', 'utf-8');

        const components = modules[moduleName];

        // auto complete elements for all component in each module
        autoCompleteComponents(components);

        // Create schema.json for each module
        const pubModDir = path.resolve(publicDir, moduleName);
        initDir(pubModDir);
        fs.writeFileSync(path.join(pubModDir, 'schema.json'), JSON.stringify(components), 'utf-8');

        // Generate the output markdown and static images
        for (const componentName in components) {
            const component = components[componentName];
            const images = component.images;

            // Copy images for each component in each module
            for (const image of images) {
                const imageSrcPath = path.resolve(sourceDir, image.path);
                const imageTgtPath = path.join(publicDir, image.path);

                // Ensure that the path exists (including sub directories)
                initDir(path.dirname(imageTgtPath));

                fs.copyFileSync(imageSrcPath, imageTgtPath);
            }

            // Create mdx doc for each component in each module
            renderComponentDoc(component, docsDir);
        }
    }
};

module.exports = generateProjectFiles;
