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
        // Fix issue where CORS request failed on 301s: Ember does not seem to append trailing
        //  slash to URLs for single documents, but DRF redirects to force a trailing slash
        if (url.lastIndexOf('/') !== 0) {
            url += '/';
        }
        return url;
    }
});
