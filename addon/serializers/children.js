import OsfSerializer from './osf-serializer';

export default OsfSerializer.extend({
    serialize: function(snapshot, options) {
        var serialized = this._super(snapshot, options);
        // Change type from 'children' to 'nodes'.  APIv2 does not have children type.
        serialized.data.type = 'nodes';
        return serialized;
    }
});
