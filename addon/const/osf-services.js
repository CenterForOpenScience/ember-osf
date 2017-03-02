import config from 'ember-get-config';

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

const host = config.OSF.url;
const osfServices = [
    {
        name: 'HOME',
        url: `${host}`,
    },
    {
        name: 'PREPRINTS',
        url: `${host}preprints/`
    },
    {
        name: 'REGISTRIES',
        url: `${host}registries/`
    },
    {
        name: 'MEETINGS',
        url: `${host}meetings/`
    }
];

export default osfServices;
