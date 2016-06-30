// jscs:disable disallowArrayDestructuringReturn
import config from 'ember-get-config';

export function getAuthUrl() {
    return `${config.OSF.oauthUrl}?response_type=token&scope=${config.OSF.scope}&client_id=${config.OSF.clientId}&redirect_uri=${encodeURI(config.OSF.redirectUri)}`;
}

export function getTokenFromHash(hash) {
    hash = hash.substring(1).split('&');
    for (let chunk of hash) {
        var [key, value] = chunk.split('=');
        if (key === 'access_token') {
            return value;
        }
    }
    return null;
}
