import Ember from 'ember';
import { serviceLinks } from '../const/service-links';

/**
 * @module ember-osf
 * @submodule helpers
 */

/**
 * Returns secondary links corresponding to a given service
 *
 * @class buildSecondaryNavLinks
 * @param {String} currentService name of current service (HOME, PREPRINTS, REGISTRIES, or MEETINGS)
 * @return {Array} Returns array of secondary link information
 */

export default Ember.Helper.extend({  // Helper defined using a class, so can inject dependencies.
    i18n: Ember.inject.service(),
    session: Ember.inject.service(),
    compute(params) { // Helpers defined using a class need a compute function
        const i18n = this.get('i18n');
        const currentService = params[0].toUpperCase();
        const session = this.get('session');
        let links = Ember.Object.create({
            HOME: [
                {
                    name: `${session.get('isAuthenticated') ? i18n.t('eosf.navbar.myProjects') : i18n.t('eosf.navbar.browse')}`,
                    href: `${session.get('isAuthenticated') ? serviceLinks.myProjects : serviceLinks.exploreActivity}`
                },
                {
                    name: i18n.t('eosf.navbar.search'),
                    href: '#'
                }

            ],
            PREPRINTS: [
                {
                    name: i18n.t('eosf.navbar.addAPreprint'),
                    href: serviceLinks.preprintsSubmit,
                    type: 'addAPreprint'
                },
                {
                    name: i18n.t('eosf.navbar.search'),
                    href: serviceLinks.preprintsDiscover
                },
                {
                    name: i18n.t('eosf.navbar.support'),
                    href: serviceLinks.preprintsSupport
                },

            ],
            REGISTRIES: [
                {
                    name: i18n.t('eosf.navbar.search'),
                    href: serviceLinks.registriesDiscover
                },
                {
                    name: i18n.t('eosf.navbar.support'),
                    href: serviceLinks.registriesSupport
                },

            ],
            MEETINGS: [
                {
                    name: i18n.t('eosf.navbar.search'),
                    href: serviceLinks.meetingsHome
                }
            ]
        });

        // If unauthenticated, add support link to HOME links. (If authenticated, support link can be found under Auth dropdown)
        if (!session.get('isAuthenticated')) {
            links.HOME.push(
                {
                    name: i18n.t('eosf.navbar.support'),
                    href: serviceLinks.osfSupport
                }
            );
        }

        if (Object.keys(links).includes(currentService)) {
            return links[currentService];
        }
        return links.HOME;  // Return Home links by default

    }
});
