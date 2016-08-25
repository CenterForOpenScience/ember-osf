import Ember from 'ember';
import layout from './template';
import config from 'ember-get-config';

import { getAuthUrl } from 'ember-osf/utils/auth';

/**
 * @module ember-osf
 * @submodule components
 */

/**
 * Display the OSF navbar
 * @class osf-navbar
 * Sample usage:
 * ```handlebars
 * {{osf-navbar
 *   hideSearch=true
 *  }}
 * ```
 */
export default Ember.Component.extend({
    layout,
    session: Ember.inject.service(),
    currentUser: Ember.inject.service(),
    onSearchPage: false,
    /**
     * Whether search icons and functionality show up
     * @property hideSearch
     * @type {Boolean}
     */
    hideSearch: false,
    gravatarUrl: Ember.computed('user', function() {
        let imgLink = this.get('user.links.profile_image');
        if (imgLink) {
            imgLink += '&s=25';
        }
        return imgLink;
    }),
    fullName: null,
    host: config.OSF.url,
    authUrl: getAuthUrl(),
    user: null,
    showSearch: false,
    _loadCurrentUser() {
        this.get('currentUser').load().then((user) => this.set('user', user));
    },
    init() {
        this._super(...arguments);
        if (this.get('session.isAuthenticated')) {
            this._loadCurrentUser();
        }
    },
    // TODO: Make these parameters configurable from... somewhere. (currently set by OSF settings module)
    allowLogin: true,
    enableInstitutions: true,
    actions: {
        toggleSearch() {
            this.toggleProperty('showSearch');
        },
        logout() {
            this.get('session').invalidate().then(() => window.location.reload(true));
        },
        loginSuccess() {
            this._loadCurrentUser();
            this.sendAction('loginSuccess');
        },
        loginFail() {
            this.sendAction('loginFail');
        }
    }
});
