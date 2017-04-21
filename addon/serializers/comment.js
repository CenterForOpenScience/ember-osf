import Ember from 'ember';
import OsfSerializer from './osf-serializer';

export default OsfSerializer.extend({
    serialize(snapshot) {
        // Add relationships field to identify comment target
        let serialized = this._super(...arguments);

        // For POST requests specifically, two additional fields are needed
        let targetID = snapshot.record.get('targetID');
        let targetType = snapshot.record.get('targetType');
        // TODO: Find a better way to detect request type, so this can enforce fields that are needed for creation (but not for editing)
        //Ember.assert('Must provide target ID', targetID);
        //Ember.assert('Must provide target type', targetType);

        if (targetID && targetType) {
            serialized.data.relationships = {
                target: {
                    data: {
                        id: targetID,
                        type: targetType
                    }
                }
            };
        }
        return serialized;
    },
    extractRelationships(modelClass, resourceHash) {
        // TODO: remove when https://openscience.atlassian.net/browse/OSF-6646 is done
        resourceHash = this._super(modelClass, resourceHash);
        resourceHash.replies.links.related = Ember.copy(resourceHash.replies.links.self);
        return resourceHash;
    }
});
