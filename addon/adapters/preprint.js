import OsfAdapter from './osf-adapter';

export default OsfAdapter.extend({
    // Overrides updateRecord on OsfAdapter. Is identical to JSONAPIAdapter > Update Record (parent's parent method).
    // NOTE: With this implementation,
    // the app cannot remove a `node` relationship and update other attributes/relationship with one .save() call.
    updateRecord(store, type, snapshot) {
        let data = {};
        let url = null;

        if (snapshot.record.get('_dirtyRelationships')['node'] && snapshot.record.get('_dirtyRelationships')['node']['remove'].length && !snapshot.record.get('_dirtyRelationships')['node']['add'].length) {
            // Supplemental project has been selected for removal.
            // Send request to relationship link to remove node
            url = this._buildRelationshipURL(snapshot, 'node');
            data = {
                'data': null
            };
        } else {
            // Preprint attributes and/or relationships have been modified.
            // Send patch request to preprint detail link
            const serializer = store.serializerFor(type.modelName);
            serializer.serializeIntoHash(data, type, snapshot, { includeId: true });
            var id = snapshot.id;
            url = this.buildURL(type.modelName, id, snapshot, 'updateRecord');
        }

        return this.ajax(url, 'PATCH', { data: data });
    }
});
