// This helps ember-browserify find npm modules in ember-cli addons

import md5 from 'npm:js-md5';  // jshint ignore:line
import config from 'ember-get-config';  // jshint ignore:line
import _get from 'npm:lodash/get';  // jshint ignore:line
import Cookie from 'npm:js-cookie';  // jshint ignore:line
import keenTracking from 'npm:keen-tracking';  // jshint ignore:line

export {default} from 'ember-osf/mixins/keen-tracker';
