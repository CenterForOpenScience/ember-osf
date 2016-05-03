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
    normalizeSingleResponse(_, __, payload) {
        payload.data.attributes = this._normalizeAttributes(payload.data.attributes);
        return this._super(...arguments);
    },
    normalizeArrayResponse(_, __, payload) {
        payload.data = payload.data.map((record) => {
            record.attributes = this._normalizeAttributes(record.attributes);
            return record;
        });
        return this._super(...arguments);
    },
    keyForAttribute(key) {
	return Ember.String.camelize(key);
    }
});
