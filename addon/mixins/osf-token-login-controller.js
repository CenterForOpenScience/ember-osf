import Ember from 'ember';

import { getAuthUrl } from 'ember-osf/utils/auth';

export default Ember.Mixin.create({
    session: Ember.inject.service(),
    actions: {
        login() {
            window.location = getAuthUrl();
        },
        loginSuccess() {},
        loginFail() {}
    }
});
