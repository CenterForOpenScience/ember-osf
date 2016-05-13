import OsfSerializer from './osf-serializer';

export default OsfSerializer.extend({
    extractAttributes(modelClass, resourceHash) {
        resourceHash.relationships.user = resourceHash.relationships.users;
        delete resourceHash.relationships.users;
        return this._super(modelClass, resourceHash);
    },
});
