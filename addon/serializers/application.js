import Ember from 'ember';
import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
    _normalizeAttributes(attributes) {
        var normalized = {};
        Object.keys(attributes).forEach(function(key) {
            normalized[Ember.String.camelize(key)] = attributes[key];
        });
        return normalized;
    },
    _normalizeRecord(record) {
	record.attributes = this._normalizeAttributes(record.attributes);
	if (record.links) {
	    record.attributes.links = record.links;
	}
	if (record.embeds) {
	    // TODO, actually merge in embedded data?
	    record.attributes.embeds = record.embeds;
	}
	return record;
    },
    normalizeSingleResponse(_, __, payload) {
        payload.data = this._normalizeRecord(payload.data);
        return this._super(...arguments);
    },
    normalizeArrayResponse(_, __, payload) {
        payload.data = payload.data.map(this._normalizeRecord.bind(this));
        return this._super(...arguments);
    },
    keyForAttribute(key) {
	return Ember.String.camelize(key);
    },

    serializeIntoHash(/*hash, typeClass, snapshot, options*/) {
	// Don't send links as part of hash
	// TODO
	return this._super(...arguments);
    }
});
