import Ember from 'ember';
import layout from './template';
import config from 'ember-get-config';

/**
 * @module ember-osf
 * @submodule components
 */

/**
 * Display a search dropdown as used in the OSF navbar
 *
 * Sample usage:
 * ```handlebars
 *   {{#search-dropdown action='toggleSearch'}}
 * ```
 * @class search-dropdown
 */
export default Ember.Component.extend({
    layout,
    host: config.OSF.url,
    query: null,
    actions: {
        // Runs toggleSearch in parent component, osf-navbar
        toggleSearch() {
            this.sendAction('action');
        },
        search() {
            var query = this.get('query');
            if (query) {
                window.location.href = this.host + 'search/?q=' + query;
            }
        }
    }
});
