import Ember from 'ember';
import layout from './template';
import config from 'ember-get-config';

/**
 * @module ember-osf
 * @submodule components
 */

/**
 * Display the OSF navbar
 *
 * Sample usage:
 * {{osf-navbar loginAction=loginAction}}
 *
 * @class osf-navbar
 */
export default Ember.Component.extend({
    layout,
    session: Ember.inject.service(),
    currentUser: Ember.inject.service(),
    onSearchPage: false,
    gravatarUrl: Ember.computed('user', function() {
        let imgLink = this.get('user.links.profile_image');
        if (imgLink) {
            imgLink += '&s=25';
        }
        return imgLink;
    }),
    fullName: null,
    host: config.OSF.url,
    user: null,
    showSearch: false,
    _loadCurrentUser() {
        this.get('currentUser').load().then((user) => this.set('user', user));
    },
    init() {
        this._super(...arguments);
        // TODO: React to changes in service/ event?
        if (this.get('session.isAuthenticated')) {
            this._loadCurrentUser();
        }
    },
    // TODO: These parameters are defined in osf settings.py; make sure ember config matches.
    allowLogin: true,
    enableInstitutions: true,
    actions: {
        toggleSearch() {
            this.toggleProperty('showSearch');
        },
        logout() {
            // TODO: May not work well if logging out from page that requires login- check?
            this.get('session').invalidate().then(() => window.location.reload(true));
        },
    }
});
