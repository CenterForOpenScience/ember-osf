import OsfSerializer from './osf-serializer';

export default OsfSerializer.extend({
    // Serialize `journal` relationship
    relationshipTypes: {
        journal: 'chronos-journals',
    },

    serialize() {
        const serialized = this._super(...arguments);
        serialized.data.attributes = {};
        return serialized;
    }
});
