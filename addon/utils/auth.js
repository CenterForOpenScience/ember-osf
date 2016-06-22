// jscs:disable disallowArrayDestructuringReturn
import config from 'ember-get-config';

export function getAuthUrl() {
    return `${config.OSF.authUrl}?response_type=token&scope=${config.OSF.scope}&client_id=${config.OSF.clientId}&redirect_uri=${encodeURI(window.location)}`;
}

export function getTokenFromHash(hash) {
    hash = hash.split('&');
    for (let chunk of hash) {
        var [key, value] = chunk.split('=');
        if (key === 'access_token') {
            return value;
        }
    }
    return null;
}
