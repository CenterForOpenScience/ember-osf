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
    }
});
