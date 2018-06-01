import OsfAdapter from './osf-adapter';

export default OsfAdapter.extend({
    buildURL(modelName, id, snapshot, requestType, query) {
        let metaschemaType = '';
        if (query) {
            metaschemaType = query.metaschemaType;
            delete query.metaschemaType;
        }
        return `${this._super(...arguments)}${metaschemaType}/`;
    },
});
