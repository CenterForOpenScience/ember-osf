import Ember from 'ember';
import layout from './template';

import config from 'ember-get-config';

/**
 * @module ember-osf
 * @submodule components
 */

/**
 * If development mode, display a red banner in the footer
 * @class osf-mode-footer
 */
export default Ember.Component.extend({
    layout,
    i18n: Ember.inject.service(),
    isDevMode: config.OSF.backend !== 'prod'
});
