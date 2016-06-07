/*
  Extend the Ember-Simple-Auth adapter to provide cookie support (when necessary)
 */
import Ember from 'ember';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

import config from 'ember-get-config';

export default Ember.Mixin.create(DataAdapterMixin, {
    ajaxOptions() {
        var hash = this._super(...arguments);

        // TODO: This mechanism is quite ugly, and will require manual ajax requests to set fields separately;
        //  suggested alternatives welcome
        if (config['ember-simple-auth'].authenticator === 'authenticator:osf-cookie') {
            Ember.$.extend(hash, {
                xhrFields: {
                    withCredentials: true
                }
            });
        }
        return hash;
    }
});
