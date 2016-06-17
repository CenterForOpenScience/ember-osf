/*
  Common properties and behaviors shared by all OSF APIv2 models
 */

import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
    links: DS.attr('links'),
    embeds: DS.attr('embed'),

    relationshipLinks: Ember.computed.alias('links.relationships'),
    _dirtyRelationships: {},
    isNewOrDirty() {
        return this.get('isNew') || Object.keys(this.changedAttributes()).length;
    },
    save(options = {
        adapterOptions: {}
    }) {
        if (options.adapterOptions.nested) {
            return this._super(...arguments);
        }

        this.eachRelationship((rel, meta) => {
            var relation;
            if (meta.kind === 'hasMany') {
                relation = this.hasMany(rel).hasManyRelationship;
            } else if (meta.kind === 'belongsTo') {
                relation = this.belongsTo(rel).belongsToRelationship;
            }
            if (relation.hasData || relation.hasLoaded) {
                var canonicalIds = relation.canonicalMembers.list.map(member => member.record.get('id'));
                var currentIds = relation.members.list.map(member => member.record.get('id'));
                var changes = {
                    create: relation.members.list.filter(m => m.record.get('isNew')),
                    add: relation.members.list.filter(m => !m.record.get('isNew') && canonicalIds.indexOf(m.record.get('id')) === -1),
                    remove: relation.canonicalMembers.list.filter(m => currentIds.indexOf(m.record.get('id')) === -1)
                };

                var other = this.get('_dirtyRelationships.${rel}') || {};
                Ember.merge(other, changes);
                this.set(`_dirtyRelationships.${rel}`, other);
            }
        });
        return this._super(...arguments);
    }
});
