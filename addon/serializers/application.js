import Ember from 'ember';
import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
    attrs: {
        links: {serialize: false},
        embeds: {serialize: false}
    },

    extractAttributes(modelClass, resourceHash) {
        // ApiV2 `links` exist outside the attributes field; make them accessible to the data model
        if (resourceHash.links) {  // TODO: Should also test whether model class defines a links field
            resourceHash.attributes.links = resourceHash.links;
        }
    	if (resourceHash.embeds) {
	        resourceHash.attributes.embeds = resourceHash.embeds;
	    }
        return this._super(modelClass, resourceHash);
    },

    keyForAttribute(key, method) {
        if (method === 'deserialize') {
            return Ember.String.underscore(key);
        } else if (method === 'serialize') {
            return Ember.String.camelize(key);
        }
    },

    serialize: function(snapshot, options) {
        var serialized = this._super(snapshot, options);
        // Don't send relationships to the server; this can lead to 500 errors.
        delete serialized.data.relationships;
        return serialized;
    }
});
