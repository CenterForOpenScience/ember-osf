import JSONAPISerializer from 'ember-data/serializers/json-api';

export default JSONAPISerializer.extend({
    modelNameFromPayloadKey() {
        return 'file-provider';
    }
});
