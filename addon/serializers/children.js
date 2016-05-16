import OsfSerializer from './osf-serializer';

export default OsfSerializer.extend({
    serialize: function(snapshot, options) {
        var serialized = this._super(snapshot, options);
        // Don't send relationships to the server; this can lead to 500 errors.
        delete serialized.data.relationships;
        // Change type from 'children' to 'nodes'.  APIv2 does not have children type.
        serialized.data.type = 'nodes';
        return serialized;
    }
});
