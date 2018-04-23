import OsfAdapter from './osf-adapter';

export default OsfAdapter.extend({
    pathForType() {
        return 'preprint_providers';
    },
    buildURL(modelName, id, snapshot, requestType, query) {
        let provider = '';
        if (query) {
            provider = query.provider;
            delete query.provider;
        } else if (requestType === 'createRecord' && snapshot.record.provider) {
            provider = snapshot.record.provider;
            delete snapshot.record.provider;
            return `${this._buildURL(modelName)}/${provider}/moderators/`;
        } else if (snapshot.adapterOptions && snapshot.adapterOptions.provider) {
            provider = snapshot.adapterOptions.provider;
            delete snapshot.adapterOptions.provider;
            if (requestType === 'updateRecord' || requestType === 'deleteRecord' || requestType === 'findRecord') {
                return `${this._buildURL(modelName)}/${provider}/moderators/${id}/`;
            }
        }

        return `${this._super(...arguments)}${provider}/moderators/`;
    }
});
