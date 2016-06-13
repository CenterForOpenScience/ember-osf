import OsfSerializer from './osf-serializer';

export default OsfSerializer.extend({
    serialize: function(snapshot, options) {
        // Restore relationships to serialized data
        var serialized = this._super(snapshot, options);
        // APIv2 expects contributor information to be nested under relationships.
        serialized.data.relationships = {
            users: {
                data: {
		    // TODO changeme when https://github.com/CenterForOpenScience/osf.io/pull/5824 goes in
                    id: snapshot.record.get('id') || snapshot.record.get('userId') || snapshot.record.id.split('-')[1],
                    type: 'users'
                }
            }
        };
        return serialized;
    }
});
