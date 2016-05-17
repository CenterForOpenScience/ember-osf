import ApplicationSerializer from 'ember-osf/serializers/application';

export default ApplicationSerializer.extend({
    modelNameFromPayloadKey() {
        return 'file-provider';
    }
});
