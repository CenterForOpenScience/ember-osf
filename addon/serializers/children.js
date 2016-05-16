import OsfSerializer from './osf-serializer';

export default OsfSerializer.extend({
    payloadKeyFromModelName: function() {
        // Overrides type 'children' with type 'nodes'. APIv2 expecting type 'nodes'.
        return 'nodes';
    }
});
