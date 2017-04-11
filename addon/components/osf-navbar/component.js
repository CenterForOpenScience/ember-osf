import Ember from 'ember';
import layout from './template';
import osfServices from '../../const/osf-services';
import serviceLinks from '../../const/service-links';
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
 * {{osf-navbar
 *   loginAction=loginAction
 *   currentService=currentService (pass in service in all caps, ex. REGISTRIES, HOME, MEETINGS, PREPRINTS)
 * }}
 * ```
 *
 * @class osf-navbar
 */
export default Ember.Component.extend({
    layout,
    session: Ember.inject.service(),
    osfServices: Ember.computed(function() {
        return osfServices;
    }),
    serviceLinks: Ember.computed(function() {
        return serviceLinks;
    }),
    host: config.OSF.url,
    currentService: 'HOME', // Pass in name of current service
    currentServiceLink: Ember.computed('serviceLinks', 'currentService', function() {
        const serviceMapping = {
            HOME: 'osfHome',
            PREPRINTS: 'preprintsHome',
            REGISTRIES: 'registriesHome',
            MEETINGS: 'meetingsHome'
        };
        const service = this.get('currentService');
        return this.get('serviceLinks')[serviceMapping[service]];
    }),
    showSearch: false,
    actions: {
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
        },
        closeSecondaryAndSearch() {
            this.send('closeSecondaryNavigation');
            this.send('closeSearch');
        }
    }

});
