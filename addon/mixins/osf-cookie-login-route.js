import Ember from 'ember';
import transitionTargetUrl from 'ember-osf/utils/transition-target-url'

/**
 * @module ember-osf
 * @submodule mixins
 */

/**
 * Route mixin for login based on OSF cookie authentication. Intended to be used in tandem with OsfCookieLoginController mixin.
 * This auth method is not available to third-party applications.
 *
 * @class OsfCookieLoginRoute
 * @extends Ember.Mixin
 * @uses ember-simple-auth/UnauthenticatedRouteMixin
 */
export default Ember.Mixin.create({
    session: Ember.inject.service(),
    beforeModel(transition) {
        // Determine whether the user is logged in by making a test request. This is quite a crude way of
        // determining whether the user has a cookie and should be improved in the future.

        // TODO: Should this check for resolution of a promise?
        this._super(...arguments);
        if (this.get('session.isAuthenticated')) return;

        // Block transition until auth attempt resolves. If auth fails, let the page load normally.
        return this.get('session').authenticate('authenticator:osf-cookie')
            .catch(err => {
                Ember.Logger.log('Authentication failed: ', err);
                // If `err` is not `undefined` and `err.readyState` is `0`, signaling a network error
                // We transition to the `error-no-api` route while keeping the transition target url.
                if (err && err.readyState === 0 && transition.targetName !== 'error-no-api') {
                    this.transitionTo('error-no-api', transitionTargetUrl(transition).slice(1));
                    return;
                }
            });
    }
});
