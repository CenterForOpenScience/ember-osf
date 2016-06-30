

import Ember from 'ember';

import { getAuthUrl } from 'ember-osf/utils/auth';

/**
 * Controller configuration mixin for a login route based on OSF cookie authentication
 * This auth method is not available to third-party applications.
  @class OsfCookieLoginController
 */
export default Ember.Mixin.create({
    session: Ember.inject.service('session'),

    queryParams: ['ticket'],
    ticket: null,

    /**
     * The authorization
     * @property authUrl
     * @type String
     * @public
     */
    authUrl: getAuthUrl()
});
