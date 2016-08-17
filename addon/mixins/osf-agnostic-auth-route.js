import Ember from 'ember';

/**
 * @module ember-osf
 * @submodule mixins
 */

/**
 * Route mixin for authentication-agnostic login: defines the application at runtime to use the authentication method
 *   specified in environment config. Intended to be used in tandem with OsfAgnosticAuthRoute mixin.
 * Some authentication methods (eg cookies) are not available to third-party applications.
 * This has limited use, since most applications will only need to support one method. It may be useful for ember apps
 *   that run inside the OSF, eg to use the standalone dev server, or to offer support for branded apps
 *   on third-party domains.
 *
 * @class OsfAgnosticAuthRoute
 * @extends Ember.Mixin
 * @uses ember-osf/OsfCookieLoginRoute
 * @uses ember-osf/OsfTokenLoginRoute
 */
export default Ember.Mixin.create({
});
