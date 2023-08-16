const fs = require('fs');
const path = require('path');
const readSchemas = require('./utils');

function getNavbarMenus(rootDir) {
    const schemas = readSchemas(rootDir);
    let menus = [];

    for (const key in schemas) {
        menus.push({ type: 'docSidebar', sidebarId: key, position: 'left', label: key });
    }

    return menus;
}

function getNavbar(rootDir) {
    return {
        // title: 'Introduction',
        logo: {
            alt: 'Uniweb Modules Logo',
            src: 'img/logo.svg',
            srcDark: 'img/logo_light.svg',
            width: 120,
            style: { marginRight: '18px' }
        },
        items: getNavbarMenus(rootDir)
    };
}

const getFooterMenus = (rootDir) => {
    const schemas = readSchemas(rootDir);
    let menus = [];

    for (const key in schemas) {
        menus.push({ label: key, to: `docs/${key}/intro` });
    }

    return menus;
};

function getFooter(rootDir) {
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
            ...getFooterMenus(rootDir)
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
                baseUrl = `${TUTORIAL_SITE_BASE_URL}tutorial/`;
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
                baseUrl = `/${repo}/tutorial/`;
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

function getConfig(rootDir, envProps, themeConfig) {
    const { url, baseUrl } = parseEnvProps(envProps);

    // import functions/plugins from the project-level scripts directory
    const makeFile = require(path.resolve(rootDir, 'scripts/fileMaker.js'));
    const prebuildPlugin = require(path.resolve(rootDir, 'scripts/prebuildPlugin.js'));

    // prebuild schemas.json if not exists
    const schemasFilePath = path.resolve(rootDir, 'static/schemas.json');
    if (!fs.existsSync(schemasFilePath)) {
        console.log('Initializing schemas.json...');
        makeFile(rootDir);
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
                        // customCss: require.resolve('./src/css/custom.css')
                        customCss: path.resolve(rootDir, 'src/css/custom.css')
                    },
                    docs: {
                        // https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-content-pages#configuration
                        // sidebarPath: require.resolve('./sidebars.js'),
                        sidebarPath: path.resolve(rootDir, 'sidebars.js')
                    }
                }
            ]
        ],
        themeConfig: { navbar: getNavbar(rootDir), footer: getFooter(rootDir), ...themeConfig }
    };
}

module.exports = getConfig;
