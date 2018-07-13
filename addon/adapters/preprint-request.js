import OsfAdapter from './osf-adapter';
import config from 'ember-get-config';

export default OsfAdapter.extend({
    urlForQuery: function (query) {
        const url = `${this.host}/${config.OSF.apiNamespace}/providers/preprints/${query.providerId}/withdraw_requests/`;
        delete query.providerId;
        return url;
    },
    urlForCreateRecord: function (modelname, snapshot) {
        const preprintId = snapshot.belongsTo('target').id;
        const url = `${this.host}/${config.OSF.apiNamespace}/preprints/${preprintId}/requests/`;
        return url;
    }
});
