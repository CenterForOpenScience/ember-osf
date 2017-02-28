import Ember from 'ember';
import layout from './template';
import config from 'ember-get-config';

/**
 * @module ember-osf
 * @submodule components
 */

/**
 * Display the new OSF navbar - features primary navigation to toggle between services - HOME, PREPRINTS, REGISTRIES, and MEETINGS,
 * and secondary navigation links for each particular service.
 *
 * Sample usage:
 * ```handlebars
 * {{new-osf-navbar
 *   loginAction=loginAction
 *   currentService=currentService (pass in service in all caps, ex. REGISTRIES, HOME, MEETINGS, PREPRINTS)
 * }}
 * ```
 *
 * @class new-osf-navbar
 */
export default Ember.Component.extend({
    layout,
    session: Ember.inject.service(),
    host: config.OSF.url,
    currentService: 'HOME',
    showSearch: false,
    osfServices: Ember.computed('currentService', function() {
        return [
            {
                name: 'HOME',
                url: `${this.get('host')}`,
            },
            {
                name: 'PREPRINTS',
                url: `${this.get('host')}preprints/`,
            },
            {
                name: 'REGISTRIES',
                url: `${this.get('host')}registries/`,
            },
            {
                name: 'MEETINGS',
                url: `${this.get('host')}meetings/`,
            }
        ];
    }),
    actions: {
        // Switches to new service
        switchService(serviceName) {
            this.set('currentService', serviceName);
        },
        // Toggles whether search bar is displayed (for searching OSF)
        toggleSearch() {
            this.toggleProperty('showSearch');
            this.send('closeSecondaryNavigation');
        },
        closeSecondaryNavigation() {
            Ember.$('.navbar-collapse').collapse('hide');
        },
        closeSearch() {
            this.set('showSearch', false);
        }
    }

});
