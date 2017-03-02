import config from 'ember-get-config';

/**
 * @module ember-osf
 * @submodule const
 */

/**
 * @class service-links
 */

/**
 * Provides some common osf links in a central location
 * @property service-links
 * @final
 * @type {Object}
 */

const osfUrl = config.OSF.url;
const serviceLinks = {
    exploreActivity: `${osfUrl}explore/activity/`,
    meetingsHome: `${osfUrl}meetings/`,
    myProjects: `${osfUrl}myprojects/`,
    osfHome: osfUrl,
    osfSupport: `${osfUrl}support/`,
    preprintsDiscover: `${osfUrl}preprints/discover/`,
    preprintsHome: `${osfUrl}preprints/`,
    preprintsSubmit: `${osfUrl}preprints/submit/`,
    preprintsSupport: 'http://help.osf.io/m/preprints/',
    profile: `${osfUrl}profile/`,
    registriesDiscover: `${osfUrl}registries/discover/`,
    registriesHome: `${osfUrl}registries/`,
    registriesSupport: 'http://help.osf.io/m/registrations/',
    settings: `${osfUrl}settings/`
};

export default serviceLinks;
