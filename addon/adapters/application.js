import Ember from 'ember';
import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

import config from 'ember-get-config';

export default DS.JSONAPIAdapter.extend(DataAdapterMixin, {
    authorizer: 'authorizer:osf-token',
    host: config.OSF.apiUrl,
    namespace: config.OSF.apiNamespace,
    pathForType: Ember.String.pluralize,

    buildURL() {
        var url = this._super(...arguments);
        if (!url.endsWith('/')) {
            url += '/';
        }
        return url;
    }
});
