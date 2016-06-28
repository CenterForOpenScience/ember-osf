import OsfSerializer from './osf-serializer';

export default OsfSerializer.extend({
    serializeIntoHash(hash, typeClass, snapshot, options) {
        if (options.forRelationship) {
            hash.data = [{
                id: snapshot.record.get('id'),
                type: 'linked_nodes'
            }];
            return hash;
        }
        return this._super(hash, typeClass, snapshot, options);
    }
});
