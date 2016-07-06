// jscs:disable disallowArrayDestructuringReturn
import Ember from 'ember';
import config from 'ember-get-config';

/**
 * @module ember-osf
 * @submodule utils
 */

/**
 * @class auth
 */

/**
 * Retrieve the correct URL for OAuth 2.0 authentication in the OSF, including any additional configurable parameters
 * @private
 * @method getOAuthUrl
 * @return {string}
 */
function getOAuthUrl() {
    return `${config.OSF.oauthUrl}?response_type=token&scope=${config.OSF.scope}&client_id=${config.OSF.clientId}&redirect_uri=${encodeURI(config.OSF.redirectUri)}`;
}

/**
 * Retrieve the correct URL for cookie-based in the OSF, including any additional configurable parameters
 * @private
 * @method getCookieAuthUrl
 * @param {string} redirectUri Where to send the browser after a successful login request
 * @return {string}
 */
function getCookieAuthUrl(redirectUri) {
    redirectUri = redirectUri || config.OSF.redirectUri;
    return `${config.OSF.cookieLoginUrl}?service=${redirectUri}&auto=true`;
}

/**
 * Return the appropriate auth URL for the specified authorization mechanism (as specified in application configuration)
 * Currently supports `token` and `cookie` based authorization
 * @public
 * @method getAuthUrl
 * @return {string}
 */
function getAuthUrl() {
    let authType = config.authorizationType;
    if (authType === 'token') {
        return getOAuthUrl(...arguments);
    } else if (authType === 'cookie') {
        return getCookieAuthUrl(...arguments);
    } else {
        throw new Ember.Error(`Unrecognized authorization type: ${authType}`);
    }
}

function getTokenFromHash(hash) {
    hash = hash.substring(1).split('&');
    for (let chunk of hash) {
        var [key, value] = chunk.split('=');
        if (key === 'access_token') {
            return value;
        }
    }
    return null;
}

export { getAuthUrl, getTokenFromHash };
