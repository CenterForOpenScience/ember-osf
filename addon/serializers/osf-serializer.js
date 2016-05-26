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
        return included.concat(included.reduce((acc, include) => acc.concat(this._extractEmbeds(include)), []));
    },

    _mergeFields(resourceHash) {
        // ApiV2 `links` exist outside the attributes field; make them accessible to the data model
        if (resourceHash.links) { // TODO: Should also test whether model class defines a links field
            resourceHash.attributes.links = resourceHash.links;
        }
        this._extractEmbeds(resourceHash);

        if (resourceHash.relationships && resourceHash.attributes.links) {
            resourceHash.attributes.links = Ember.$.extend(resourceHash.attributes.links, { relationships: resourceHash.relationships });
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
    },

    normalizeArrayResponse(store, primaryModelClass, payload, id, requestType) {  // jshint ignore:line
        // Ember data does not yet support pagination. For any request that returns more than one result, extract
        //  links.meta from the payload links section, and add to the model metadata manually.
        let documentHash = this._super(...arguments);
        documentHash.meta = documentHash.meta || {};
        documentHash.meta.pagination = Ember.get(payload || {}, 'links.meta');
        return documentHash;
    }
});
