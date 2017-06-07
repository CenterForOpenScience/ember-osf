import config from 'ember-get-config';

/**
 * @module ember-osf
 * @submodule utils
 */

/**
 * @class host-service-name
 */

/**
 * This function is useful for retrieving the hostname from the environment.js for the hosting app. This is needed to
 * allow ember-osf addons identify their hosting apps.
 *
 * @method hostServiceName
 * @return {String}
 */
export default function hostServiceName() {
    return config.modulePrefix;
}

export { hostServiceName };
