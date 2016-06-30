// jscs:disable disallowArrayDestructuringReturn
import Ember from 'ember';
import config from 'ember-get-config';

/**
 * Retrieve the correct URL for OAuth 2.0 authentication in the OSF, including any additional configurable parameters
 * @private
 * @returns {string}
 */
function getOAuthUrl() {
    return `${config.OSF.oauthUrl}?response_type=token&scope=${config.OSF.scope}&client_id=${config.OSF.clientId}&redirect_uri=${encodeURI(config.OSF.redirectUri)}`;
}

/**
 * Retrieve the correct URL for cookie-based in the OSF, including any additional configurable parameters
 * @private
 * @returns {string}
 */
function getCookieAuthUrl() {
    // TODO: jigger redirectURI to cookielogin, then consolidate the two login forms to one shared behavior set
    return `${config.OSF.cookieLoginUrl}?service=${config.OSF.redirectUri}&auto=true`;
}

/**
 * Return the appropriate auth URL for the specified authorization mechanism (as specified in application configuration)
 * Currently supports `token` and `cookie` based authorization
 * @public
 * @returns {string}
 */
function getAuthUrl() {
    let authType = config.authorizationType;
    console.log('selecting authorizer!');
    if (authType === 'token') {
        return getOAuthUrl();
    } else if (authType === 'cookie') {
        return getCookieAuthUrl();
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
