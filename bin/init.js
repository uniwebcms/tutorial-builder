#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const { version } = require('../package.json');

const init = (projectName) => {
    const projectDir = path.join(process.cwd(), projectName);

    try {
        // Check if the destination directory already exists
        if (fs.existsSync(projectDir)) {
            throw new Error(`Directory "${projectName}" already exists.`);
        }

        // Get the template directory path from your npm module
        const templateDir = path.join(path.dirname(__dirname), 'template');

        // Copy the template directory to the destination directory
        fs.copySync(templateDir, projectDir);

        // Create .gitignore file in the destination directory
        const gitignore = path.join(projectDir, '.gitignore');
        const gitignoreContent = `# Tutorial Builder output directories
/docs/
/static/modules/
`;

        if (!fs.existsSync(gitignore)) {
            fs.writeFileSync(gitignore, gitignoreContent);
        }

        const message = 'Project initialized successfully. (version: ' + chalk.green(version) + ')';
        console.log(message);
    } catch (error) {
        console.error('Error initializing project:', error.message);
        process.exit(1);
    }
};

exports.init = init;
