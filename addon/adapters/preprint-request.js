import OsfAdapter from './osf-adapter';
import config from 'ember-get-config';

export default OsfAdapter.extend({
    buildURL: function(modelName, id, snapshot, requestType, query) {
        let url;
        if (requestType === 'query') {
            const providerId = query.providerId;
            const preprintId = query.preprintId;
            url = `${this.host}/${config.OSF.apiNamespace}/providers/preprints/${query.providerId}/withdraw_requests/`;
            delete query.providerId;
        }
        return url;
    },
});
