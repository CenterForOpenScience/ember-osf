import Ember from 'ember';
import layout from './template';
import config from 'ember-get-config';

/**
 * @module ember-osf
 * @submodule components
 */

/**
 * Display the OSF navbar
 *
 * Sample usage:
 * ```handlebars
 * {{osf-navbar
 *   loginAction=loginAction
 *   hideSearch=true}}
 * ```
 *
 * @class osf-navbar
 */
export default Ember.Component.extend({
    layout,
    i18n: Ember.inject.service(),
    session: Ember.inject.service(),
    onSearchPage: false,
    /**
     * Whether search icons and functionality show up
     * @property hideSearch
     * @type {Boolean}
     */
    hideSearch: false,

    host: config.OSF.url,

    showSearch: false,

    actions: {
        toggleSearch() {
            this.toggleProperty('showSearch');
        },
    }
});
