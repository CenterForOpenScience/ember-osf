import Ember from 'ember';

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
    }
});
