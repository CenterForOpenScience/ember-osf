import OsfAdapter from './osf-adapter';

export default OsfAdapter.extend({
    // Overrides updateRecord on OsfAdapter. Is identical to JSONAPIAdapter > Update Record (parent's parent method).
    // Updates to preprints do not need special handling.
    updateRecord(store, type, snapshot) {
        var data = {};
        var serializer = store.serializerFor(type.modelName);

        serializer.serializeIntoHash(data, type, snapshot, { includeId: true });

        var id = snapshot.id;
        var url = this.buildURL(type.modelName, id, snapshot, 'updateRecord');

        return this.ajax(url, 'PATCH', { data: data });
        }
});
