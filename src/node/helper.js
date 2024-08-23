const fs = require('fs');
const yaml = require('js-yaml');

const autoSchema = loadYaml(__dirname + '/auto_schema.yml');

function loadYaml(fullPath) {
    // Read YAML file and convert YAML content to JS object
    return yaml.load(fs.readFileSync(fullPath, 'utf8'));
}

function autoCompleteComponent(component, template) {
    let { elements, items } = component;

    if (Array.isArray(elements)) {
        elements = Object.fromEntries(elements.map((key) => [key, null]));
    }

    const autoElements = template.elements || {};

    for (const role in elements) {
        elements[role] ??= {};

        if (autoElements[role]) {
            const element = elements[role];
            const template = autoElements[role];

            for (const key in template) {
                if (!element.hasOwnProperty(key)) {
                    element[key] = template[key];
                }
            }
        }
    }

    if (items) {
        autoCompleteComponent(items, template);
    }
}

function autoCompleteComponents(components) {
    for (const componentName in components) {
        const component = components[componentName];

        autoCompleteComponent(component, autoSchema);
    }
}

module.exports = {
    autoCompleteComponents
};
