import Ember from 'ember';
import serviceLinks from '../const/service-links';

/**
 * @module ember-osf
 * @submodule helpers
 */

/**
 * Returns secondary links corresponding to a given service
 *
 * @class buildSecondaryNavLinks
 * @param {String} currentService name of current service (HOME, PREPRINTS, REGISTRIES, or MEETINGS)
 * @param {Object} session Injected session
 * @return {Array} Returns array of secondary link information
 */
export function buildSecondaryNavLinks(params/*, hash*/) {
    const currentService = params[0].toUpperCase();
    const session = params[1];
    let links = Ember.Object.create({
        HOME: [
            {
                name: `${session.get('isAuthenticated') ? 'My Projects' : 'Browse'}`,
                href: `${session.get('isAuthenticated') ? serviceLinks.myProjects : serviceLinks.exploreActivity}`
            },
             {
                name: 'Search',
                href: '#'
            }

        ],
        PREPRINTS: [
            {
                name: 'Add a preprint',
                href: serviceLinks.preprintsSubmit
            },
             {
                name: 'Search',
                href: serviceLinks.preprintsDiscover
            },
             {
                name: 'Support',
                href: serviceLinks.preprintsSupport
            },

        ],
        REGISTRIES: [
             {
                name: 'Search',
                href: serviceLinks.registriesDiscover
            },
             {
                name: 'Support',
                href: serviceLinks.registriesSupport
            },

        ],
        MEETINGS: [
             {
                name: 'Search',
                href: serviceLinks.meetingsHome
            }
        ]
    });

    if (!session.isAuthenticated) {
        links.HOME.push(
            {
                name: 'Support',
                href: serviceLinks.support
            }
        );
    }

    if (Object.keys(links).includes(currentService)) {
        return links[currentService];
    }
    return links.HOME;  // Return Home links by default

}

export default Ember.Helper.helper(buildSecondaryNavLinks);
