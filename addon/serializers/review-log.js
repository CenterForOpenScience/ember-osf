import OsfSerializer from './osf-serializer';

export default OsfSerializer.extend({
    // Serialize reviewable relationship
    relationshipTypes: {
        reviewable: 'preprints',
    },
});
