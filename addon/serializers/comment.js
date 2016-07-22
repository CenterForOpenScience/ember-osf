import Ember from 'ember';
import OsfSerializer from './osf-serializer';

export default OsfSerializer.extend({
    serializeIntoHash(hash, typeClass, snapshot, options) {  // jshint ignore:line
        if (options.forRelationship) {
            // New comments must identify their target as part of a relationship field
            // TODO: pop off record when done so these dummy fields don't persist? Do they matter?
            // TODO: This breaks commenting atm
            let targetID = snapshot.record.get('targetID');
            let targetType = snapshot.record.get('targetType');
            Ember.assert('Must provide target ID', targetID);
            Ember.assert('Must provide target type', targetType);

            hash.data.relationships = {
                target: {
                    data: {
                        id: targetID,
                        type: targetType
                    }
                }
            }
        }
        return this._super(hash, typeClass, snapshot, options);
    },
    extractRelationships(modelClass, resourceHash) {
        // TODO: remove when https://openscience.atlassian.net/browse/OSF-6646 is done
        resourceHash = this._super(modelClass, resourceHash);
        resourceHash.replies.links.related = Ember.copy(resourceHash.replies.links.self);
        return resourceHash;
    }
});
