import Ember from 'ember';
import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

import config from 'ember-get-config';

export default DS.JSONAPIAdapter.extend(DataAdapterMixin, {
    authorizer: 'authorizer:osf-token',
    host: config.OSF.apiUrl,
    namespace: config.OSF.apiNamespace,
    pathForType: Ember.String.pluralize,

    buildURL(modelName, id, snapshot, requestType, query) {  // jshint ignore:line
        var url = this._super(...arguments);
        // TODO: Is this still necessary?
        if (url.lastIndexOf('/') !== 0) {
            url += '/';
        }
        return url;
    }
});
