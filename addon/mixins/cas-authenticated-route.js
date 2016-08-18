import Ember from 'ember';
import { getAuthUrl } from 'ember-osf/utils/auth';

/**
 * @module ember-osf
 * @submodule mixins
 */

/**
 * Replacement for Ember-simple-auth AuthenticatedRouteMixin. Instead of redirecting to an internal route,
 *   this mixin redirects to CAS login URL, and brings the user back to the last requested page afterwards
 *
 * For OAuth this is done via the state parameter, and for cookies this is done via the service parameter. (TODO: Need a mixin that detects this!)
 *
 * @class CasAuthenticatedRouteMixin
 */
export default Ember.Mixin.create({
    /**
      The session service.
      @property session
      @readOnly
      @type SessionService
      @public
    */
    session: Ember.inject.service('session'),

    /**
      Checks whether the session is authenticated, and if it is not, redirects to the login URL. (Sending back to this page after a successful transition)

      __If `beforeModel` is overridden in a route that uses this mixin, the route's
     implementation must call `this._super(...arguments)`__ so that the mixin's
     `beforeModel` method is actually executed.
      @method beforeModel
      @public
    */
    beforeModel() {
        if (!this.get('session.isAuthenticated')) {
            window.location = getAuthUrl(window.location);
        } else {
            return this._super(...arguments);
        }
    }
});
