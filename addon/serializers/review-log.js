import OsfSerializer from './osf-serializer';
import Ember from 'ember';

export default OsfSerializer.extend({
    // Serialize reviewable relationship
    relationshipTypes: {
        reviewable: 'preprints',
    },
});
