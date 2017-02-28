import Ember from 'ember';
import config from 'ember-get-config';

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
    const osfUrl = config.OSF.url;
    let links = Ember.Object.create({
        HOME: [
            {
                name: `${session.isAuthenticated ? 'My Projects' : 'Browse'}`,
                href: `${session.isAuthenticated ? `${osfUrl}myprojects/` : `${osfUrl}explore/activity/`}`
            },
             {
                name: 'Search',
                href: '#'
            }

        ],
        PREPRINTS: [
            {
                name: 'Add a preprint',
                href: `${osfUrl}preprints/submit/`
            },
             {
                name: 'Search',
                href: `${osfUrl}preprints/discover`
            },
             {
                name: 'Support',
                href: 'http://help.osf.io/m/preprints'
            },

        ],
        REGISTRIES: [
             {
                name: 'Search',
                href: `${osfUrl}registries/discover`
            },
             {
                name: 'Support',
                href: 'http://help.osf.io/m/registrations'
            },

        ],
        MEETINGS: [
             {
                name: 'Search',
                href: `${osfUrl}meetings`
            }
        ]
    });

    if (!session.isAuthenticated) {
        links.HOME.push(
            {
                name: 'Support',
                href: `${osfUrl}support/`
            }
        );
    }

    if (Object.keys(links).includes(currentService)) {
        return links[currentService];
    }
    return links['HOME'];  // Return Home links by default

}

export default Ember.Helper.helper(buildSecondaryNavLinks);
