/* jshint node: true */
'use strict';
var path = require('path');
var config = require('config');
var Funnel = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');
var compileSass = require('broccoli-sass-source-maps');

module.exports = {
    name: 'ember-osf',
    blueprintsPath: function() {
        return path.join(__dirname, 'blueprints');
    },
    config: function(environment, ENV) {
        let BACKEND = process.env.BACKEND || 'local';
        let SETTINGS = {};
        try {
            SETTINGS = config.get(BACKEND);
        } catch (e) {
            console.log(`WARNING: you\'ve specified a backend '${BACKEND}' that you have not configured in your config/local.yml`);
        }

        // For i18n
        ENV.i18n = {
            defaultLocale: 'en-US'
        };

        ENV.OSF = {
            clientId: SETTINGS.CLIENT_ID,
            scope: SETTINGS.OAUTH_SCOPES,
            apiNamespace: 'v2', // URL suffix (after host)
            backend: BACKEND,
            redirectUri: SETTINGS.REDIRECT_URI
        };

        switch (BACKEND) {
            case 'local':
                ENV.OSF = {
                    url: 'http://localhost:5000/',
                    apiUrl: 'http://localhost:8000',

                    // Where to direct the user for cookie-based authentication
                    cookieLoginUrl: 'http://localhost:8080/login',
                    // Where to direct the user for oauth2-based authentication
                    oauthUrl: 'http://localhost:8080/oauth2/profile',
                    renderUrl: 'http://localhost:7778/render',
                    waterbutlerUrl : 'http://localhost:7777/',
                    helpUrl: 'http://localhost:4200/help',

                    accessToken: SETTINGS.PERSONAL_ACCESS_TOKEN,
                    isLocal: true
                };
                break;
            case 'stage':
                ENV.OSF = {
                    url: 'https://staging.osf.io/',
                    apiUrl: 'https://staging-api.osf.io',
                    cookieLoginUrl: 'https://staging-accounts.osf.io/login',
                    oauthUrl: 'https://staging-accounts.osf.io/oauth2/authorize',
                    renderUrl: 'https://staging-mfr.osf.io/render',
                    waterbutlerUrl: 'http://staging-files.osf.io/',
                    helpUrl: 'http://help.osf.io'
                };
                break;
            case 'stage2':
                ENV.OSF = {
                    url: 'https://staging2.osf.io/',
                    apiUrl: 'https://staging2-api.osf.io',
                    cookieLoginUrl: 'https://staging2-accounts.osf.io/login',
                    oauthUrl: 'https://staging2-accounts.osf.io/oauth2/authorize',
                    renderUrl: 'https://staging2-mfr.osf.io/render',
                    waterbutlerUrl: 'http://staging2-files.osf.io/',
                    helpUrl: 'http://help.osf.io'
                };
                break;
            case 'stage3':
                ENV.OSF = {
                    url: 'https://staging3.osf.io/',
                    apiUrl: 'https://staging3-api.osf.io',
                    cookieLoginUrl: 'https://staging3-accounts.osf.io/login',
                    oauthUrl: 'https://staging3-accounts.osf.io/oauth2/authorize',
                    renderUrl: 'https://staging3-mfr.osf.io/render',
                    waterbutlerUrl: 'http://staging3-files.osf.io/',
                    helpUrl: 'http://help.osf.io'
                };
                break;
            case 'test':
                ENV.OSF = {
                    url: 'https://test.osf.io/',
                    apiUrl: 'https://test-api.osf.io',
                    cookieLoginUrl: 'https://test-accounts.osf.io/login',
                    oauthUrl: 'https://test-accounts.osf.io/oauth2/authorize',
                    renderUrl: 'https://test-mfr.osf.io/render',
                    waterbutlerUrl: 'http://test-files.osf.io/',
                    helpUrl: 'http://help.osf.io'
                };
                break;
            case 'prod':
                console.log(`WARNING: you\'ve specified production as a backend. Please do not use production for testing or development purposes`);
                ENV.OSF = {
                    url: 'https://osf.io/',
                    apiUrl: 'https://api.osf.io',
                    cookieLoginUrl: 'https://accounts.osf.io/login',
                    oauthUrl: 'https://accounts.osf.io/oauth2/authorize',
                    renderUrl: 'https://mfr.osf.io/render',
                    waterbutlerUrl: 'http://files.osf.io/',
                    helpUrl: 'http://help.osf.io'

                };
                break;
            default:
                break;
        }
        ENV['ember-simple-auth'] = {
            authorizer: 'authorizer:osf-token'
        };
    },
    afterInstall: function(options) {
        if (options['ember-osf'].includeStyles) {
            this.addAddonToProject('ember-font-awesome');
        }
    },
    included: function(app) {
        // Documentation of the `included` hook is mostly in the comment
        // threads of `ember-cli` issues on github. For example:
        // https://github.com/ember-cli/ember-cli/issues/3531#issuecomment-81133458
        this._super.included.apply(this, arguments);

        if (app.options['ember-osf'] && app.options['ember-osf'].includeStyles) {
            app.options['ember-font-awesome'] = {
                useScss: true
            };
        }
        return app;
    },
    treeForAddon: function(tree) {
        this.addonTree = tree;
        return this._super.treeForAddon.apply(this, arguments);
    },
    treeForVendor: function(tree) {
        var addonStyleTree = this._treeFor('addon-styles');
        var addonPodStyles = new Funnel(this.addonTree, {
            include: [
                'components/**/*css'
            ]
        });
        var addonCss = compileSass(
            [addonStyleTree, addonPodStyles],
            'addon.scss',
            'assets/ember-osf.css',
            {
                annotation: 'EmberOsf Sass Tree'
            });
        return mergeTrees([tree, addonCss].filter(Boolean));
    },
    treeForPublic() {
        var assetDir = path.join(path.resolve(this.root, ''), 'addon/assets');
        return new Funnel(assetDir, {
            destDir: 'assets/'
        });
    }
};
