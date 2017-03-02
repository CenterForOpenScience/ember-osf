import serviceLinks from './service-links';

/**
 * @module ember-osf
 * @submodule const
 */

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
    }
];

export default osfServices;
