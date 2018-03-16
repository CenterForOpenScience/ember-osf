import Ember from 'ember';
import layout from './template';
import config from 'ember-get-config';

/**
 * @module ember-osf
 * @submodule components
 */

/**
 * Display the login dropdown on the navbar
 *
 * Sample usage:
 * ```handlebars
 * {{navbar-auth-dropdown
 *   loginAction=loginAction
 *   redirectUrl=redirectUrl}}
 * ```
 *
 * @class navbar-auth-dropdown
 */
export default Ember.Component.extend({
    layout,
    i18n: Ember.inject.service(),
    session: Ember.inject.service(),
    currentUser: Ember.inject.service(),

    tagName: 'li',
    classNames: ['dropdown'],
    classNameBindings: ['notAuthenticated:sign-in'],
    notAuthenticated: Ember.computed.not('session.isAuthenticated'),
    redirectUrl: null,

    /**
     * The URL to use for signup. May be overridden, eg for special campaign pages
     *
     * @property signupUrl
     * @type {String}
     */
    signupUrl: config.OSF.url + 'register',

    gravatarUrl: Ember.computed('user', function() {
        let imgLink = this.get('user.links.profile_image');

        return imgLink ? `${imgLink}&s=25` : '';
    }),
    host: config.OSF.url,
    user: null,
    _loadCurrentUser() {
        this.get('currentUser')
            .load()
            .then(user => this.set('user', user));
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
        logout() {
            const redirectUrl = this.get('redirectUrl');
            const query = redirectUrl ? '?' + Ember.$.param({ next: redirectUrl }) : '';
            // TODO: May not work well if logging out from page that requires login- check?
            this.get('session').invalidate()
                .then(() => window.location.href = `${config.OSF.url}logout/${query}`);
        },
    }
});
