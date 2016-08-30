import Ember from 'ember';
import config from 'ember-get-config';

import OsfTokenLoginController from '../mixins/osf-token-login-controller';
import OsfCookieLoginController from '../mixins/osf-cookie-login-controller';

/**
 * @module ember-osf
 * @submodule mixins
 */
var AuthMixin;

let authType = config.authorizationType;
if (authType === 'token') {
    AuthMixin = OsfTokenLoginController;
} else if (authType === 'cookie') {
    AuthMixin = OsfCookieLoginController;
} else {
    throw new Ember.Error(`Unrecognized authorization type: ${authType}`);
}
/**
 * Controller mixin for authentication-agnostic login: defines the application at runtime to use the authentication method
 *   specified in environment config. Intended to be used in tandem with OsfAuthController mixin.
 * Some authentication methods (eg cookies) are not available to third-party applications.
 * This has limited use, since most applications will only need to support one method. It may be useful for ember apps
 *   that run inside the OSF, eg to use the standalone dev server, or to offer support for branded apps
 *   on third-party domains.
 *
 * @class OsfAgnosticAuthController
 * @extends Ember.Mixin
 * @uses ember-osf/OsfCookieLoginController
 * @uses ember-osf/OsfTokenLoginController
 */
export default AuthMixin;
