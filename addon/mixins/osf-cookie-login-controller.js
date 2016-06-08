/*
    Mixin that provides methods for a login route based on OSF cookie authentication
    This auth method is not available to third-party applications

    Sample code and structure based on documentation for https://github.com/simplabs/ember-simple-auth
 */

import Ember from 'ember';
import config from 'ember-get-config';

export default Ember.Mixin.create({
    session: Ember.inject.service('session'),

    queryParams: ['ticket'],
    ticket: null,

    // Form submission URL:
    submitUrl: `${config.OSF.cookieLoginUrl}?service=${window.location.href}&auto=true`
});
