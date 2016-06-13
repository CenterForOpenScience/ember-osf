import Ember from 'ember';
import OsfSerializer from './osf-serializer';

export default OsfSerializer.extend({
    serialize(snapshot, options) {  // jshint ignore:line
        // Add relationships field to identify comment target
        let serialized = this._super(...arguments);
        let targetID = snapshot.record.get('targetID');
        let targetType = snapshot.record.get('targetType');
        Ember.assert('Must provide target ID', targetID);
        Ember.assert('Must provide target type', targetType);

        serialized.data.relationships = {
            target: {
                data: {
                    id: targetID,
                    type: targetType
                }
            }
        };
        return serialized;
    }
});
