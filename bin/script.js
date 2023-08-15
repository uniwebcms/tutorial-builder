#!/usr/bin/env node

const chalk = require('chalk');
const { init } = require('./init');

const action = process.argv[2];
const projectName = process.argv[3] || 'tutorial';

if (action === 'init') {
    // perform initialization
    try {
        init(projectName);
    } catch (err) {
        console.error('Error during initialization:', err.message);
        process.exit(1);
    }
} else {
    console.log('Unknown action:', chalk.cyan(action));
    console.log('Here are the available actions:');
    console.log(chalk.cyan('init'), '- Initializes a new project. Usage: ' + chalk.green('npx @uniwebcms/tutorial-builder init [project-name]'));
    process.exit(1);
}
