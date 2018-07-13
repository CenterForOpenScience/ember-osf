import OsfSerializer from './osf-serializer';

export default OsfSerializer.extend({
    // Serialize `target` relationship
    relationshipTypes: {
        target: 'preprints',
    },
});
