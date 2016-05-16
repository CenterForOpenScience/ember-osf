/*
  Base serializer class for all OSF APIv2 endpoints
 */
import Ember from 'ember';
import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
    attrs: {
        links: {
            serialize: false
        },
        embeds: {
            serialize: false
        }
    },

    _mergeFields(resourceHash) {
        // ApiV2 `links` exist outside the attributes field; make them accessible to the data model
        if (resourceHash.links) { // TODO: Should also test whether model class defines a links field
            resourceHash.attributes.links = resourceHash.links;
        }
        if (resourceHash.embeds) {
            resourceHash.attributes.embeds = resourceHash.embeds;
        }
        return resourceHash;
    },

    extractAttributes(modelClass, resourceHash) {
        resourceHash = this._mergeFields(resourceHash);
        return this._super(modelClass, resourceHash);
    },

    keyForAttribute(key) {
        return Ember.String.underscore(key);
    },

    keyForRelationship(key) {
        return Ember.String.underscore(key);
    },

    serialize: function(snapshot, options) {
        var serialized = this._super(snapshot, options);
        // Don't send relationships to the server; this can lead to 500 errors.
        delete serialized.data.relationships;
        return serialized;
    },

    serializeAttribute(snapshot, json, key, attribute) {  // jshint ignore:line
        // In certain cases, a field may be omitted from the server payload, but have a value (undefined)
        // when serialized from the model. (eg node.template_from)
        // Omit fields with a value of undefined before sending to the server. (but still allow null to be sent)
        let val = snapshot.attr(key);
        if (val !== undefined) {
            this._super(...arguments);
        }
    }

});
