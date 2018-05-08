import Ember from 'ember';
import { task } from 'ember-concurrency';
import config from 'ember-get-config';
import { authenticatedAJAX } from 'ember-osf/utils/ajax-helpers';
/**
 * @module ember-osf
 * @submodule services
 */

/**
 * Access information about the currently logged in user
 *
 * @class current-user
 * @extends Ember.Service
 */
export default Ember.Service.extend({
    store: Ember.inject.service(),
    session: Ember.inject.service(),
    features: Ember.inject.service(),

    waffleLoaded: false,

    init() {
        this._super(...arguments);
        this.get('setWaffle').perform();

        const session = this.get('session');

        session.on('authenticationSucceeded', this, () => this.get('setWaffle').perform());
        session.on('invalidationSucceeded', this, () => this.get('setWaffle').perform());
    },

    setWaffle: task(function* () {
        const url = `${config.OSF.apiUrl}/v2/_waffle/`;
        const { data } = yield authenticatedAJAX({
            url,
            method: 'GET',
        });
        for (const flag of data) {
            const { name, active } = flag.attributes;
            if (active) {
                this.get('features').enable(name);
            } else {
                this.get('features').disable(name);
            }
        }
        this.set('waffleLoaded', true);
    }).restartable(),

    getWaffle: task(function* (flag) {
        const setWaffle = this.get('setWaffle');

        if (setWaffle.isRunning) {
            yield setWaffle.last;
        } else if (!this.get('waffleLoaded')) {
            yield setWaffle.perform();
        }
        return this.get('features').isEnabled(flag);
    }),

    /**
     * If logged in, return the ID of the current user, else return null.
     *
     * @property currentUserId
     * @type {String|null}
     */
    currentUserId: Ember.computed('session.data.authenticated', function() {
        var session = this.get('session');
        if (session.get('isAuthenticated')) {
            return session.get('data.authenticated.id');
        } else {
            return null;
        }
    }),

    /**
     * Fetch information about the currently logged in user. If no user is logged in, this method returns a rejected promise.
     * @method load
     * @return {Promise}
     */
    load() {
        return new Ember.RSVP.Promise((resolve, reject) => {
            var currentUserId = this.get('currentUserId');
            if (currentUserId) {
                var currentUser = this.get('store').peekRecord('user', currentUserId);
                if (currentUser) {
                    resolve(currentUser);
                } else {
                    this.get('store').findRecord('user', currentUserId).then((user) => resolve(user), reject);
                }
            } else {
                reject();
            }
        });
    },

    /**
     * Return an observable promise proxy for the currently logged in user. If no user is logged in, resolves to null.
     *
     * @property user
     * @return Promise proxy object that resolves to a user or null
     */
    user: Ember.computed('currentUserId', function() {
        const ObjectPromiseProxy = Ember.ObjectProxy.extend(Ember.PromiseProxyMixin);
        return ObjectPromiseProxy.create({
            promise: this.load().catch(() => null),
        });
    }),

    /**
     * Return a simple hash of the currentUser ID if user is logged in, otherwise return a generated random string.
     * sessionKey can be used to identify the current session or any general purposes.
     * For Elasticsearch requests, sessionKey is used as the "preference" URL parameter to ensure reproducible search results ordering.
     *
     * @property sessionKey
     * @return {String}
     */
    sessionKey: Ember.computed('currentUserId', function() {
        let currentUserId = this.get('currentUserId');
        if (currentUserId) {
            return this.hashCode(currentUserId).toString();
        }
        return Math.random().toString(36).substr(2,10);
    }),

    /**
     * Generate a simple hash (numerical code) from a string.
     * https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery
     *
     * @method hashCode
     * @param  str {String}
     * @return {String}
     */

    hashCode(str) {
        let hash = 0, i, chr;
        if (str.length === 0) return hash;
        for (i = 0; i < str.length; i++) {
            chr   = str.charCodeAt(i);
            hash  = ((hash << 5) - hash) + chr;
            hash |= 0;
        }
        return hash;
    },

});
