/*jshint node:true*/
/* global require, module */
var path = require('path');
var EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
    var app = new EmberAddon(defaults, {
        sassOptions: {
            includePaths: [
                'tests/dummy/app/components',
                'bower_components/c3',
                'bower_components/bootstrap-daterangepicker',
            ]
        },

        // FIXME
        // FIXME Will this affect downstream consumers (when they build their apps)?
        // FIXME
        // This is really for building the application. It's a hack so we can use the dummy app inside the OSF to test development.
        // It's for production builds, and we may want to comment it out when needed. Usage:
        //   ember build --output-path ../osf.io/website/static/ember/ --environment=production --watch
        //////// Uncomment the lines below to test!
        // fingerprint: {
        //     prepend: 'static/ember/'
        // },

        babel: {
            includePolyfill: true
        }
    });

    app.import(path.join(app.bowerDirectory, 'dropzone/dist/basic.css'));
    app.import(path.join(app.bowerDirectory, 'dropzone/dist/dropzone.css'));
    app.import(path.join(app.bowerDirectory, 'dropzone/dist/dropzone.js'));
    app.import(path.join(app.bowerDirectory, 'bootstrap-daterangepicker/daterangepicker.js'));
    app.import(path.join(app.bowerDirectory, 'lodash/lodash.js'));

    app.import(path.join(app.bowerDirectory, 'jquery.tagsinput/src/jquery.tagsinput.js'));
    app.import(path.join(app.bowerDirectory, 'c3/c3.js'));
    app.import(path.join(app.bowerDirectory, 'd3/d3.js'));
    app.import(path.join(app.bowerDirectory, 'osf-style/css/base.css'));
    app.import('vendor/assets/ember-osf.css');
    return app.toTree();
};
