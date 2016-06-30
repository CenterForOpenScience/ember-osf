import Ember from 'ember';

import OsfTokenLoginControllerMixin from 'ember-osf/mixins/osf-token-login-controller';

import {
    getAuthUrl
} from 'ember-osf/utils/auth';

export default Ember.Controller.extend(OsfTokenLoginControllerMixin , {
    toast: Ember.inject.service(),
    authUrl: getAuthUrl(),
    actions: {
        loginSuccess() {
            this.transitionToRoute('index');
        },
        loginFail(/* err */) {
            this.get('toast').error('Login failed');
        }
    }
});
