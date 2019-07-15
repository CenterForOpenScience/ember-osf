import OsfAdapter from './osf-adapter';

export default OsfAdapter.extend({
    namespace: '_/chronos',
    urlForQuery: function (query) {
        const url = `${this.host}/${this.namespace}/${query.preprintId}/submissions/`;
        delete query.preprintId;
        return url;
    },

    urlForCreateRecord: function (modelname, snapshot) {
        const preprintId = snapshot.belongsTo('preprint').id;
        const url = `${this.host}/${this.namespace}/${preprintId}/submissions/`;
        return url;
    },

    urlForUpdateRecord: function (id, modelName, snapshot) {
        const preprintId = snapshot.belongsTo('preprint').id;
        const submissionId = snapshot.id;
        const url = `${this.host}/${this.namespace}/${preprintId}/submissions/${submissionId}`;
        return url;
    },

    updateRecord: function (store, type, snapshot) {
        let data = {};
        let serializer = store.serializerFor(type.modelName);
        serializer.serializeIntoHash(data, type, snapshot);
        let id = snapshot.id;
        let url = this.buildURL(type.modelName, id, snapshot, 'updateRecord');
        return this.ajax(url, "PUT", { data });
    }
});
