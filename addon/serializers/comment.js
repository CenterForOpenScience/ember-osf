import Ember from 'ember';
import OsfSerializer from './osf-serializer';

export default OsfSerializer.extend({
    serialize(snapshot, options) {  // jshint ignore:line
        let res = this._super(...arguments);

        let adapterOptions = snapshot.adapterOptions;
        if (adapterOptions.operation === 'create') {
            let targetType = adapterOptions.targetType;
            // New comments must explicitly identify their target, passed here via fields on .save({adapterOptions: {...}})
            Ember.assert('Must provide target ID', adapterOptions.targetID);
            Ember.assert('Must provide target type', targetType);

            // Preprint comments are made through the node
            if (targetType === 'preprint') {
                targetType = 'node';
            }

            res.data.relationships = {
                target: {
                    data: {
                        id: adapterOptions.targetID,
                        type: Ember.Inflector.inflector.pluralize(targetType)
                    }}};
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
