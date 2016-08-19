import Ember from 'ember';
import OsfSerializer from './osf-serializer';

export default OsfSerializer.extend({
    serialize: function(snapshot, options = {}) {
        // Restore relationships to serialized data
        var serialized = this._super(snapshot, options);

        var opts = {
            includeUser: true
        };
        Ember.merge(opts, options);

        // APIv2 expects contributor information to be nested under relationships.
        if (opts.includeUser) {
            serialized.data.relationships = {
                users: {
                    data: {
                        id: snapshot.record.get('userId'),
                        type: 'users'
                    }
                }
            };
        }
        return serialized;
    }
});
