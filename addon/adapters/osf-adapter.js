/*
  Base adapter class for all OSF APIv2 endpoints
 */
import DS from 'ember-data';

import config from 'ember-get-config';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default DS.JSONAPIAdapter.extend(DataAdapterMixin, {
    authorizer: config['ember-simple-auth'].authorizer,
    host: config.OSF.apiUrl,
    namespace: config.OSF.apiNamespace,

    buildURL(modelName, id, snapshot, requestType, query) {  // jshint ignore:line
        var url = this._super(...arguments);
        // Fix issue where CORS request failed on 301s: Ember does not seem to append trailing
        //  slash to URLs for single documents, but DRF redirects to force a trailing slash
        if (url.lastIndexOf('/') !== 0) {
            url += '/';
        }

        console.log('authorizer', config['ember-simple-auth'].authorizer);
        return url;
    }
});
