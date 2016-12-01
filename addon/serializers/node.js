import OsfSerializer from './osf-serializer';

export default OsfSerializer.extend({
    serialize(snapshot) {
        // Normal OSF serializer strips out relationships. We need to add back primaryFile/node/provider for this endpoint
        const res = this._super(...arguments);
        res.data.relationships = {};
        let hasRelation = false;
        for (var rel in snapshot.record._dirtyRelationships) {
            let relationship = Ember.String.underscore(rel);
            if (relationship.includes('license')) {
                res.data.relationships[relationship] = {
                    data: {
                        id: snapshot.belongsTo(rel, { id: true }),
                        type: 'licenses'
                    }
                };
                hasRelation = true;
            }
        }
        if (!hasRelation) {
            delete res.data.relationships;
        }
        return res;
    }
});
