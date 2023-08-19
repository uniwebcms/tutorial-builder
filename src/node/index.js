const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const makeFile = require('./fileMaker');
const prebuildPlugin = require('./prebuildPlugin');

function readSchemas() {
    const output = {};

    const rootDir = path.resolve(process.cwd(), 'static', 'schemas');

    const modules = fs.readdirSync(rootDir);

    for (const module of modules) {
        const schema = path.resolve(rootDir, module, 'schema.json');
        const content = fs.readFileSync(schema, 'utf8');

        output[module] = JSON.parse(content);
    }

    return output;
}

function getNavbarMenus() {
    const schemas = readSchemas();
    let menus = [];

    for (const key in schemas) {
        menus.push({ type: 'docSidebar', sidebarId: key, position: 'left', label: key });
    }

    return menus;
}

function getNavbar() {
    return {
        logo: {
            alt: 'Uniweb Modules Logo',
            src: 'img/logo.svg',
            srcDark: 'img/logo_light.svg',
            width: 120,
            style: { marginRight: '18px' }
        },
        items: getNavbarMenus()
    };
}

const getFooterMenus = () => {
    const schemas = readSchemas();
    let menus = [];

    for (const key in schemas) {
        menus.push({ label: key, to: `docs/${key}/intro` });
    }

    return menus;
};

function getFooter() {
    return {
        style: 'dark',
        logo: {
            alt: 'Uniweb Modules Logo',
            src: 'img/logo_light.svg',
            width: 160,
            height: 51
        },
        links: [
            {
                label: 'Docs',
                to: '/'
            },
            ...getFooterMenus()
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Tutorial website by <a href="https://proximify.com">Proximify</a>.`
    };
}

function parseEnvProps(envProps) {
    let url, baseUrl;

    const { npm_lifecycle_event, TUTORIAL_SITE_URL, TUTORIAL_SITE_BASE_URL, GITHUB_REPOSITORY_OWNER, GITHUB_REPOSITORY } = envProps;

    switch (npm_lifecycle_event) {
        case 'start':
        case 'build:dev':
        case 'serve:dev':
            url = 'http://localhost';
            baseUrl = '/';
            break;
        case 'build:prod':
            if (TUTORIAL_SITE_URL && TUTORIAL_SITE_BASE_URL) {
                url = TUTORIAL_SITE_URL;
                baseUrl = `${TUTORIAL_SITE_BASE_URL}_docs/`;
                break;
            } else {
                let message =
                    chalk.yellow.bold('Warning! ') +
                    chalk.white('Critical environment variables are missing. This could potentially occur when building in production mode locally without setting the value of: ') +
                    chalk.magenta.bold('TUTORIAL_SITE_URL') +
                    chalk.white(' and ') +
                    chalk.magenta.bold('TUTORIAL_SITE_BASE_URL') +
                    chalk.white('.');

                message += chalk.blue.bold('\n\nHint! ') + chalk.white('Double check the value in .env\n');
                console.log(message);

                throw new Error("Error occurs when build under production mode: 'build:prod'");
            }
        case 'build:gh':
            if ((GITHUB_REPOSITORY_OWNER, GITHUB_REPOSITORY)) {
                url = `https://${GITHUB_REPOSITORY_OWNER}.github.io`;

                const repo = GITHUB_REPOSITORY.replace(GITHUB_REPOSITORY_OWNER, '').replace(/^\/|\/$/g, '');
                baseUrl = `/${repo}/_docs/`;
                break;
            } else {
                let message = chalk.yellow.bold('Warning! ') + chalk.white('Critical environment variables are missing. This could potentially occur when building in production mode outside of the GitHub Actions Workflow environment.');
                message += chalk.blue.bold('\n\nHint! ') + chalk.white('If you want to build locally in production mode, try ') + chalk.cyan.bold('build:prod') + chalk.white('.\n');

                console.log(message);

                throw new Error("Error occurs when build under development mode: 'build:gh'");
            }
    }

    return { url, baseUrl };
}

function getConfig(envProps, themeConfig) {
    const { url, baseUrl } = parseEnvProps(envProps);
    const rootDir = process.cwd();

    // prebuild schemas.json if not exists
    const schemasFilePath = path.resolve(rootDir, 'static/schemas.json');
    if (!fs.existsSync(schemasFilePath)) {
        console.log('Initializing schemas.json...');
        makeFile();
    }

    return {
        title: 'Website Components',
        tagline: 'Tutorial of Website Components',
        url,
        baseUrl,
        onBrokenLinks: 'warn',
        onBrokenMarkdownLinks: 'warn',
        favicon: 'img/favicon.png',
        plugins: [[prebuildPlugin, { rootDir }]],
        presets: [
            [
                '@docusaurus/preset-classic',
                {
                    theme: {
                        customCss: path.resolve(rootDir, 'src/css/custom.css')
                    },
                    docs: {
                        // https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-content-pages#configuration
                        sidebarPath: require.resolve('./sidebars.js')
                    }
                }
            ]
        ],
        themeConfig: { navbar: getNavbar(), footer: getFooter(), ...themeConfig }
    };
}

module.exports = { readSchemas, getConfig };
