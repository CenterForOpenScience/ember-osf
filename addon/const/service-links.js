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
    myPreprints: `${osfUrl}myprojects/#preprints`,
    myProjects: `${osfUrl}myprojects/`,
    myQuickFiles: `${osfUrl}quickfiles/`,
    osfHome: osfUrl,
    osfSupport: `${osfUrl}support/`,
    preprintsDiscover: `${osfUrl}preprints/discover/`,
    preprintsHome: `${osfUrl}preprints/`,
    preprintsSubmit: `${osfUrl}preprints/submit/`,
    preprintsSupport: 'https://openscience.zendesk.com/hc/en-us/categories/360001530554-Preprints',
    profile: `${osfUrl}profile/`,
    registriesDiscover: `${osfUrl}registries/discover/`,
    registriesHome: `${osfUrl}registries/`,
    registriesSupport: 'https://openscience.zendesk.com/hc/en-us/categories/360001550953-Registrations',
    search: `${osfUrl}search/`,
    settings: `${osfUrl}settings/`,
    settingsNotifications: `${osfUrl}settings/notifications/`,
    reviewsHome: `${osfUrl}reviews/`,
    institutionsLanding: `${osfUrl}institutions/`,
};


/**
 * @class osf-services
 */

/**
 * Provides list of OSF services and their links
 * @property osfServices
 * @final
 * @type {Array}
 */

const osfServices = [
    {
        name: 'HOME',
        url: serviceLinks.osfHome,
    },
    {
        name: 'PREPRINTS',
        url: serviceLinks.preprintsHome
    },
    {
        name: 'REGISTRIES',
        url: serviceLinks.registriesHome
    },
    {
        name: 'MEETINGS',
        url: serviceLinks.meetingsHome
    },
    {
        name: 'INSTITUTIONS',
        url: serviceLinks.institutionsLanding,
    }
];

export {
    serviceLinks,
    osfServices
};
