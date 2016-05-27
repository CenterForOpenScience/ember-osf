import Ember from 'ember';

const inflector = new Ember.Inflector(Ember.Inflector.defaultRules);

/**
 * Serialize the hasMany relationship of a record
 *
 * @method serializeHasMany
 * @param {String} relationship Name of the relationship attribute as representd on the model
 * @param {String} type API type of the related resource being serialized
 * @param {DS.Model} record DS.Model instance to pull related data off of
 * @return {Object} Serialized data
 */
export function serializeHasMany(relationship, type, record) {
    return {
        data: record.get(relationship).map(record => {
            return {
                type: inflector.pluralize(type),
                id: record.id
            };
	})
    };
}

export function serializeBelongsTo(relationship, type, record) { // jshint ignore:line
    // TODO
    return {};
}
