import Ember from 'ember';
import OsfSerializer from './osf-serializer';

export default OsfSerializer.extend({
    serialize(snapshot, options) {  // jshint ignore:line
        let res = this._super(...arguments);
        if (Ember.get(snapshot, 'adapterOptions.forRelationship')) {  // TODO: Next iteration: would be nice for createRelated to pass fields directly, to avoid placeholder fields.
            // New comments must identify their target as part of a relationship field
            let targetID = snapshot.record.get('targetID');
            let targetType = snapshot.record.get('targetType');
            Ember.assert('Must provide target ID', targetID);
            Ember.assert('Must provide target type', targetType);
            res.data.relationships = {
                target: {
                    data: {
                        id: targetID,
                        type: targetType
                    }
                }
            };
        }
        return res;
    },
    extractRelationships(modelClass, resourceHash) {
        // TODO: remove when https://openscience.atlassian.net/browse/OSF-6646 is done
        resourceHash = this._super(modelClass, resourceHash);
        resourceHash.replies.links.related = Ember.copy(resourceHash.replies.links.self);
        return resourceHash;
    }
});
