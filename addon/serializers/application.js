import Ember from 'ember';
import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({

    // TODO: Pre-1.0, refactor this into a separate OSF serializer, so we can support other microservices such as WB
    attrs: {
        links: {
            serialize: false
        },
        embeds: {
            serialize: false
        }
    },

    _extractEmbeds(resourceHash) {
        if (!resourceHash.embeds) {
            return []; // Nothing to do
        }
        let included = [];
        resourceHash.relationships = resourceHash.relationships || {};
        for (let embedded in resourceHash.embeds) {
            if (!(embedded || resourceHash.embeds[embedded])) {
                continue;
            }
            //TODO Pagination probably breaks here
            let data = resourceHash.embeds[embedded].data;
            if (Array.isArray(data)) {
                included = included.concat(data);
            } else {
                included.push(data);
            }
            resourceHash.embeds[embedded].type = embedded;
            //Only needs to contain id and type but this way we don't have to special case arrays
            resourceHash.relationships[embedded] = resourceHash.embeds[embedded];
        }
        delete resourceHash.embeds;
        //Recurse in, includeds are only processed on the top level. Emebeds are nested.
        return included.concat(included.reduce((acc, include) =>  acc.concat(this._extractEmbeds(include)), []));
    },

    _mergeFields(resourceHash) {
        // ApiV2 `links` exist outside the attributes field; make them accessible to the data model
        if (resourceHash.links) {  // TODO: Should also test whether model class defines a links field
            resourceHash.attributes.links = resourceHash.links;
        }

        return resourceHash;
    },

    _normalizeDocumentHelper(documentHash) {
	// Note: overrides a private method of the JSONAPISerializer. This is the best place to get the raw
	// serialized document.
        documentHash.included = this._extractEmbeds(documentHash.data);
        return this._super(documentHash);
    },

    extractAttributes(modelClass, resourceHash) {
        resourceHash = this._mergeFields(resourceHash);
        return this._super(modelClass, resourceHash);
    },

    keyForAttribute(key, method) {
        if (method === 'deserialize') {
            return Ember.String.underscore(key);
        } else if (method === 'serialize') {
            return Ember.String.camelize(key);
        }
        return key;
    },
    keyForRelationship(key) {
        return Ember.String.underscore(key);
    },

    serialize: function(snapshot, options) {
        var serialized = this._super(snapshot, options);
        // Don't send relationships to the server; this can lead to 500 errors.
        delete serialized.data.relationships;
        return serialized;
    }
});
