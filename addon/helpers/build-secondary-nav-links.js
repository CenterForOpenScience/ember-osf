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
    const [currentService, session] = params;
    const osfUrl = config.OSF.url;
    const links = {
        'HOME': [
            {
                name: `${session.isAuthenticated ? "My Projects" : "Browse"}`,
                href: `${session.isAuthenticated ? `${osfUrl}myprojects/` : `${osfUrl}explore/activity/`}`
            },
             {
                name: "Search",
                href: `${osfUrl}`
            },
             {
                name: "Support",
                href: `${osfUrl}support/`
            },

        ],
        'PREPRINTS': [
            {
                name: "Add a preprint",
                href: `${osfUrl}preprints/submit/`
            },
             {
                name: "Search",
                href: `${osfUrl}preprints/discover`
            },
             {
                name: "Support",
                href: "http://help.osf.io/m/preprints"
            },

        ],
        'REGISTRIES': [
             {
                name: "Search",
                href: `${osfUrl}registries/discover`
            },
             {
                name: "Support",
                href: "#"
            },

        ],
        'MEETINGS': [
             {
                name: "Search",
                href: `${osfUrl}meetings`
            }
        ]
    };
    return links[currentService];
}

export default Ember.Helper.helper(buildSecondaryNavLinks);
