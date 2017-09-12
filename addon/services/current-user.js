import Ember from 'ember';

/**
 * @module ember-osf
 * @submodule services
 */

/**
 * Access information about the currently logged in user
 * Proxies all undefined properties to the the user returned by /users/me/
 * @class current-user
 * @extends Ember.Service
 */
export default Ember.Service.extend(Ember.ObjectProxy.PrototypeMixin, Ember.PromiseProxyMixin, {
    store: Ember.inject.service(),
    session: Ember.inject.service(),

    init() {
        // Trigger initial KVO cycle
        // Because Services don't automatically... because why would they :|
        this.set('promise', this.get('promise'));

        this._super(...arguments);
    },

    // The promise for PromiseProxyMixin
    promise: Ember.computed('session.data.authenticated', {
        get() {
            let userId = this.get('currentUserId');
            if (!userId) return Ember.RSVP.resolve(null);

            let user = this.get('store').peekRecord('user', userId);
            if (user) return Ember.RSVP.resolve(user);

            return this.get('store').findRecord('user', userId);
        },
        set(key, value) {
            // HACK: We need to use the original setter, which is in a closure (go figure), to make the PromiseProxyMixin work
            return Ember.PromiseProxyMixin.mixins[0].properties.promise._setter.apply(this, [key, value]);
        }
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
        return this.get('promise');
    }
});
