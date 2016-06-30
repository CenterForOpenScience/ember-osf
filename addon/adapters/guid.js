import JSONAPIAdapter from 'ember-data/adapters/json-api';

import config from 'ember-get-config';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default JSONAPIAdapter.extend(DataAdapterMixin, {
    authorizer: 'authorizer:osf-token',
    host: config.OSF.apiUrl,
    namespace: config.OSF.apiNamespace,
    buildURL() {
	var url = this._super(...arguments);
	if (url.lastIndexOf('/') !== url.length - 1) {
            url += '/';
        }
        return `${url}?resolve=false`;
    }
});
