import OsfSerializer from './osf-serializer';

export default OsfSerializer.extend({
    serialize: function(snapshot, options) {
        // Restore relationships to serialized data
        var serialized = this._super(snapshot, options);
        serialized.data.relationships = {
            users: {
                data: {
                    id: serialized.data.id,
                    type: 'users'
                }
            }
        };
        return serialized;
    },
});
