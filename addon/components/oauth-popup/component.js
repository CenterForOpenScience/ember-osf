import Ember from 'ember';
import layout from './template';

import { getTokenFromHash } from 'ember-osf/utils/auth';

/**
 * @module ember-osf
 * @submodule components
 */

/**
 * Log a user in via OAuth2 in a popup window, without requiring a redirect
 *
 * Sample usage:
 * ```handlebars
 * {{#oauth-popup
 *   authUrl=authUrl
 *   loginSuccess=(action 'loginSuccess')
 *   loginFail=(action 'loginFail') as |popup|}}
 *    <button class="btn btn-default login-button" onclick={{action 'login' target=popup}} >
 *       Login to OSF
 *    </button>
 * {{/oauth-popup}}
 * ```
 * @class oauth-popup
 */
export default Ember.Component.extend({
    layout,
    tagName: '',
    i18n: Ember.inject.service(),
    session: Ember.inject.service(),
    popupHeight: 550,
    popupWidth: 500,
    authUrl: null,
    popup: null,
    redirectRoute: null,
    _openPopup() {
        let {
            popupHeight,
            popupWidth,
            popup
        } = this.getProperties('popupWidth', 'popupHeight', 'popup');

        if (popup) {
            popup.close();
        }
        let width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
        let height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

        let left = ((width / 2) - (popupWidth / 2));
        let top = (height / 2);
        this.set('popup', window.open(
            this.get('authUrl'),
            'Authentication',
            `resizeable=true, width=${popupWidth}, height=${popupHeight}, top=${top}, left=${left}`
        ));
        // Puts focus on the new window
        if (window.focus) {
            this.popup.focus();
        }

        // wait for the popup window to be closed, by the user or completion of authorization redirect.
        return new Ember.RSVP.Promise((resolve /* , reject */) => {
            let timer = window.setInterval(() => {
                popup = this.get('popup');
                if (!popup || (popup.location.origin === window.location.origin)) {
                    var accessToken = getTokenFromHash(popup.location.hash);
                    popup.close();
                    window.clearInterval(timer);
                    resolve(accessToken);
                }
            }, 100);
        });
    },
    actions: {
        login() {
            this._openPopup().then((accessToken) => this.get('session').authenticate('authenticator:osf-token', accessToken)
                .then(
                    () => this.sendAction('loginSuccess'),
                    err => this.sendAction('loginFail', err)
                ));
        }
    }
});
