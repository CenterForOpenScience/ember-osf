import Ember from 'ember';
import DS from 'ember-data';

import HasManyQuery from 'ember-data-has-many-query';

/**
 * @module ember-osf
 * @submodule models
 */

/**
 * Common properties and behaviors shared by all OSF APIv2 models
 *
 * @class OsfModel
 * @public
 */
export default DS.Model.extend(HasManyQuery.ModelMixin, {
    links: DS.attr('links'),
    embeds: DS.attr('embed'),

    relationshipLinks: Ember.computed.alias('links.relationships'),
    _dirtyRelationships: null,
    isNewOrDirty() {
        return this.get('isNew') || Object.keys(this.changedAttributes()).length;
    },
    init() {
        this._super(...arguments);
        this.set('_dirtyRelationships', Ember.Object.create({}));
    },
    /**
     * Looks up relationship on model and returns hasManyRelationship
     * or belongsToRelationship object.
     *
     * @method resolveRelationship
     * @private
     * @param {String} rel Name of the relationship on the model
     **/
    resolveRelationship(rel) {
        var relation;
        var meta = this[rel].meta();
        if (meta.kind === 'hasMany') {
            relation = this.hasMany(rel).hasManyRelationship;
        } else if (meta.kind === 'belongsTo') {
            relation = this.belongsTo(rel).belongsToRelationship;
        }
        return relation;
    },
    save(options = {
        adapterOptions: {}
    }) {
        if (options.adapterOptions.nested) {
            return this._super(...arguments);
        }

        this.set('_dirtyRelationships', {});
        this.eachRelationship((rel) => {
            var relation = this.resolveRelationship(rel);
            // TODO(samchrisinger): not sure if hasLoaded is a subset if the hasData state
            if (relation.hasData && relation.hasLoaded) {
                var canonicalIds = relation.canonicalMembers.list.map(member => member.getRecord().get('id'));
                var currentIds = relation.members.list.map(member => member.getRecord().get('id'));
                var changes = {
                    create: relation.members.list.filter(m => m.getRecord().get('isNew')),
                    add: relation.members.list.filter(m => !m.getRecord().get('isNew') && canonicalIds.indexOf(m.getRecord().get('id')) === -1),
                    remove: relation.canonicalMembers.list.filter(m => currentIds.indexOf(m.getRecord().get('id')) === -1)
                };

                var other = this.get('_dirtyRelationships.${rel}') || {};
                Ember.merge(other, changes);
                this.set(`_dirtyRelationships.${rel}`, other);
            }
        });
        return this._super(...arguments);
    }
});
