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
    session: Ember.inject.service(),
    currentUser: Ember.inject.service(),
    compute(params) { // Helpers defined using a class need a compute function
        const currentService = params[0].toUpperCase();
        const baseServiceUrl = params[1];
        const session = this.get('session');
        let links = Ember.Object.create({
            HOME: [
                {
                    name: 'eosf.navbar.search',
                    href: serviceLinks.search,
                    type: 'search'
                },
                {
                    name: 'eosf.navbar.support',
                    href: serviceLinks.osfSupport
                },
                {
                    name: 'eosf.navbar.donate',
                    href: 'https://cos.io/donate',
                    type: 'donateToCOS'
                },

            ],
            PREPRINTS: [
                {
                    name: 'eosf.navbar.addAPreprint',
                    href: Ember.isEmpty(baseServiceUrl) ? serviceLinks.preprintsSubmit : baseServiceUrl + 'submit',
                    type: 'addAPreprint'
                },
                {
                    name: 'eosf.navbar.search',
                    href: Ember.isEmpty(baseServiceUrl) ? serviceLinks.preprintsDiscover : baseServiceUrl + 'discover',
                    type: 'search'
                },
                {
                    name: 'eosf.navbar.support',
                    href: serviceLinks.preprintsSupport
                },
                {
                    name: 'eosf.navbar.donate',
                    href: 'https://cos.io/donate',
                    type: 'donateToCOS'
                },

            ],
            REGISTRIES: [
                {
                    name: 'eosf.navbar.search',
                    href: serviceLinks.registriesDiscover,
                    type: 'search'
                },
                {
                    name: 'eosf.navbar.support',
                    href: serviceLinks.registriesSupport
                },
                {
                    name: 'eosf.navbar.donate',
                    href: 'https://cos.io/donate',
                    type: 'donateToCOS'
                },

            ],
            MEETINGS: [
                {
                    name: 'eosf.navbar.search',
                    href: serviceLinks.meetingsHome,
                    type: 'search'
                },
                {
                    name: 'eosf.navbar.donate',
                    href: 'https://cos.io/donate',
                    type: 'donateToCOS'
                },

            ]
        });

        // If unauthenticated, add support link to HOME links. (If authenticated, support link can be found under Auth dropdown)
        if(session.get('isAuthenticated')) {
            links.HOME.unshift(
                {
                    name: 'eosf.navbar.myQuickFiles',
                    href: serviceLinks.myQuickFiles
                },
                {
                    name: 'eosf.navbar.myProjects',
                    href: serviceLinks.myProjects,
                }
            );
            links.PREPRINTS.unshift(
                {
                    name: 'eosf.navbar.myPreprints',
                    href: serviceLinks.myPreprints,
                    type: 'myPreprints'
                }
            );
            this.get('currentUser.user').then((user) => {
                if (user.get('canViewReviews')) {
                    links.PREPRINTS.insertAt(1, {
                        name: 'eosf.navbar.reviews',
                        href: serviceLinks.reviewsHome,
                    });
                }
            })
        }

        if (Object.keys(links).includes(currentService)) {
            return links[currentService];
        }
        return links.HOME;  // Return Home links by default

    }
});
