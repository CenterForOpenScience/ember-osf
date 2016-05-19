import Serializer from 'ember-data/serializers/json-api';

export default Serializer.extend({
    type: null,
    serialize: function(snapshot) {	
	return {
            type: this.get('type'),
            id: snapshot.record.get('id')
        };
    }
});
