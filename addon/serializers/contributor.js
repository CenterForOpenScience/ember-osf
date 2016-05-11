import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
    extractAttributes(modelClass, resourceHash) {
        resourceHash.relationships.user = resourceHash.relationships.users;
        delete resourceHash.relationships.users;
        return this._super(modelClass, resourceHash);
    },
});
