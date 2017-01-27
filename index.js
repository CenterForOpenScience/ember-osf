/* jshint node: true */
'use strict';
var path = require('path');
var config = require('config');
var Funnel = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');
var compileSass = require('broccoli-sass-source-maps');

// Fetch a list of known backends. The user can always choose to override any of these URLs via ENV vars
var knownBackends = require('./config/backends');

module.exports = {
    name: 'ember-osf',
    blueprintsPath: function() {
        return path.join(__dirname, 'blueprints');
    },
    config: function(environment, ENV) {
        let BACKEND = process.env.BACKEND || 'local';
        // Settings required to configure the developer application, primarily for OAuth2
        let OAUTH_SETTINGS = {};
        // Backwards compatibility: old config.yml files were nested, with keys like "local", "test", etc.
        // New ones are flat- you specify the values you want once. If there is no <backendname> key, assume
        // this is a flat config file and access keys accordingly.
        OAUTH_SETTINGS = config['BACKEND'] || config;

        // For i18n
        ENV.i18n = {
            defaultLocale: 'en-US'
        };

        ENV.OSF = {
            clientId: OAUTH_SETTINGS.CLIENT_ID,
            scope: OAUTH_SETTINGS.OAUTH_SCOPES,
            apiNamespace: 'v2', // URL suffix (after host)
            backend: BACKEND,
            redirectUri: OAUTH_SETTINGS.REDIRECT_URI
        };

        // Fetch configuration information for the application
        var backendConfig = knownBackends[BACKEND] || {};

        if (BACKEND === 'local') {
            backendConfig.accessToken = OAUTH_SETTINGS.PERSONAL_ACCESS_TOKEN;
            backendConfig.isLocal = true;
        } else if (BACKEND === 'prod') {
            console.log("WARNING: you've specified production as a backend. Please do not use production for testing or development purposes");
        }

        // TODO: Deal with incomplete or unrecognized config? (since config comes from env variables, backends, or both, need to check at end)
        ENV.OSF = backendConfig;

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
