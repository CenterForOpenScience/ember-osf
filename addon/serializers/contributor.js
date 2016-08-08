import OsfSerializer from './osf-serializer';

export default OsfSerializer.extend({
    serialize: function(snapshot, options) {
        // Restore relationships to serialized data
        var serialized = this._super(snapshot, options);
        // APIv2 expects contributor information to be nested under relationships.
        var id = snapshot.record.get('id');
        if (snapshot.adapterOptions && snapshot.adapterOptions.requestType === 'create') {
            id = snapshot.record.get('userId');
        }
        serialized.data.relationships = {
            users: {
                data: {
                    id: id,
                    type: 'users'
                }
            }
        };
        return serialized;
    }
});
