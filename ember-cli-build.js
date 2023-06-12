/* eslint-env node */
var path = require('path');
var EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
    var app = new EmberAddon(defaults, {
      'ember-bootstrap': {
          bootstrapVersion: 3,
          importBootstrapFont: true,
          importBootstrapCSS: false
      },
      sassOptions: {
          includePaths: [
              'node_modules/bootstrap-sass/assets/stylesheets',
              'node_modules/osf-style/sass',
              'node_modules/bootstrap-daterangepicker',
              'tests/dummy/app/components',
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

      'ember-cli-babel': {
          includePolyfill: true
      },
    });

    app.import(path.join('node_modules', 'dropzone/dist/basic.css'));
    app.import(path.join('node_modules', 'dropzone/dist/dropzone.css'));
    app.import(path.join('node_modules', 'dropzone/dist/dropzone.js'));
    app.import(path.join('node_modules', 'bootstrap-daterangepicker/daterangepicker.js'));
    app.import(path.join('node_modules', 'lodash/index.js'));

    app.import(path.join('node_modules', 'jquery-tags-input/src/jquery.tagsinput.js'));
    app.import(path.join('node_modules', 'osf-style/css/base.css'));
    app.import(path.join('node_modules', 'ember-source/dist/ember-template-compiler.js'));
    app.import(path.join('node_modules', 'jquery-mockjax/dist/jquery.mockjax.js'));
    return app.toTree();
};
