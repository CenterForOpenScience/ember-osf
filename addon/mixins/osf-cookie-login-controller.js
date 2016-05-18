/*
    Mixin that provides methods for a login route based on OSF cookie authentication
    This auth method is not available to third-party applications

    Sample code and structure based on documentation for https://github.com/simplabs/ember-simple-auth
 */

import Ember from 'ember';

export default Ember.Mixin.create({
    session: Ember.inject.service('session'),

    queryParams: ['ticket'],
    ticket: null,

    errorMessage: undefined,

    actions: { // TODO: What does submit do in the new scheme? Needs to be form post, so probably nothing
        loginHandler: function (username, password) {
            console.log('Called submit', username, password);
            //this.get('session').authenticate('authenticator:osf-cookie', username, password)
            //    .catch((reason) => this.set('errorMessage', reason.error || reason));
            return true;
        }
    }
});
